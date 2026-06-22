import fs from "node:fs";
import { builtinModules } from "node:module";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import ts from "typescript";

const CORE_DIRECTORY = "src/game-core";
const FORBIDDEN_SOURCE_DIRECTORIES = ["src/app", "src/content", "src/ui"];
const FORBIDDEN_PACKAGE_PREFIXES = [
  "@ai-sdk/",
  "@anthropic-ai/",
  "@supabase/",
  "@vercel/",
  "anthropic",
  "axios",
  "cross-fetch",
  "isomorphic-fetch",
  "next",
  "node-fetch",
  "openai",
  "react",
  "react-dom",
  "undici",
  "ws",
];
const FORBIDDEN_NODE_MODULES = new Set(
  builtinModules.flatMap((moduleName) => [moduleName, moduleName.split("/")[0]]),
);
const FORBIDDEN_BROWSER_GLOBALS = new Set([
  "document",
  "fetch",
  "localStorage",
  "navigator",
  "sessionStorage",
  "WebSocket",
  "window",
  "XMLHttpRequest",
]);

function normalizePath(value) {
  return value.split(path.sep).join("/");
}

function isPathInside(candidate, directory) {
  return candidate === directory || candidate.startsWith(`${directory}/`);
}

function sourceDirectoryForSpecifier(filePath, specifier) {
  if (specifier.startsWith("@/")) {
    return `src/${specifier.slice(2)}`;
  }

  if (specifier.startsWith("src/")) {
    return specifier;
  }

  if (specifier.startsWith(".")) {
    return path.posix.normalize(path.posix.join(path.posix.dirname(filePath), specifier));
  }

  return undefined;
}

function forbiddenImportReason(filePath, specifier) {
  const sourceDirectory = sourceDirectoryForSpecifier(filePath, specifier);

  if (
    sourceDirectory &&
    FORBIDDEN_SOURCE_DIRECTORIES.some((directory) =>
      isPathInside(sourceDirectory, directory),
    )
  ) {
    return "game-core cannot import app, content, or UI modules";
  }

  if (
    FORBIDDEN_PACKAGE_PREFIXES.some((prefix) =>
      prefix.endsWith("/")
        ? specifier.startsWith(prefix)
        : specifier === prefix || specifier.startsWith(`${prefix}/`),
    )
  ) {
    return "game-core cannot import framework, provider, or network packages";
  }

  const nodeModule = specifier.startsWith("node:") ? specifier.slice(5) : specifier;
  if (FORBIDDEN_NODE_MODULES.has(nodeModule)) {
    return "game-core cannot import Node.js runtime modules";
  }

  if (/^https?:\/\//u.test(specifier)) {
    return "game-core cannot import network URLs";
  }

  return undefined;
}

function moduleSpecifierFromNode(node) {
  if (
    (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
    node.moduleSpecifier &&
    ts.isStringLiteralLike(node.moduleSpecifier)
  ) {
    return node.moduleSpecifier;
  }

  if (
    ts.isImportEqualsDeclaration(node) &&
    ts.isExternalModuleReference(node.moduleReference) &&
    node.moduleReference.expression &&
    ts.isStringLiteralLike(node.moduleReference.expression)
  ) {
    return node.moduleReference.expression;
  }

  if (
    ts.isCallExpression(node) &&
    node.arguments.length === 1 &&
    ts.isStringLiteralLike(node.arguments[0]) &&
    (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
      (ts.isIdentifier(node.expression) && node.expression.text === "require"))
  ) {
    return node.arguments[0];
  }

  return undefined;
}

function isBrowserGlobalReference(node) {
  if (!ts.isIdentifier(node) || !FORBIDDEN_BROWSER_GLOBALS.has(node.text)) {
    return false;
  }

  const parent = node.parent;
  return !(
    (ts.isPropertyAccessExpression(parent) && parent.name === node) ||
    (ts.isPropertyAssignment(parent) && parent.name === node) ||
    (ts.isPropertyDeclaration(parent) && parent.name === node) ||
    (ts.isMethodDeclaration(parent) && parent.name === node) ||
    (ts.isBindingElement(parent) && parent.name === node) ||
    (ts.isVariableDeclaration(parent) && parent.name === node) ||
    (ts.isParameter(parent) && parent.name === node) ||
    ts.isImportSpecifier(parent)
  );
}

export function findBoundaryViolations(filePath, sourceText) {
  const normalizedFilePath = normalizePath(filePath);
  const scriptKind = normalizedFilePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const sourceFile = ts.createSourceFile(
    normalizedFilePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    scriptKind,
  );
  const violations = [];

  function addViolation(node, message) {
    const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
    violations.push({
      filePath: normalizedFilePath,
      line: position.line + 1,
      column: position.character + 1,
      message,
    });
  }

  function visit(node) {
    const moduleSpecifier = moduleSpecifierFromNode(node);
    if (moduleSpecifier) {
      const reason = forbiddenImportReason(normalizedFilePath, moduleSpecifier.text);
      if (reason) {
        addViolation(moduleSpecifier, `${reason}: ${JSON.stringify(moduleSpecifier.text)}`);
      }
    }

    if (isBrowserGlobalReference(node)) {
      addViolation(node, `game-core cannot use browser global ${JSON.stringify(node.text)}`);
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return violations;
}

function collectTypeScriptFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      return collectTypeScriptFiles(entryPath);
    }

    return entry.isFile() && /\.tsx?$/u.test(entry.name) ? [entryPath] : [];
  });
}

export function checkImportBoundaries(repositoryRoot = process.cwd()) {
  const coreDirectory = path.join(repositoryRoot, CORE_DIRECTORY);
  if (!fs.existsSync(coreDirectory)) {
    throw new Error(`Missing boundary root: ${coreDirectory}`);
  }

  return collectTypeScriptFiles(coreDirectory).flatMap((absoluteFilePath) => {
    const relativeFilePath = normalizePath(path.relative(repositoryRoot, absoluteFilePath));
    return findBoundaryViolations(relativeFilePath, fs.readFileSync(absoluteFilePath, "utf8"));
  });
}

function run() {
  const violations = checkImportBoundaries();
  if (violations.length === 0) {
    console.log("Import boundaries passed: src/game-core is framework and infrastructure independent.");
    return;
  }

  console.error("Import boundary violations:");
  for (const violation of violations) {
    console.error(
      `${violation.filePath}:${violation.line}:${violation.column} ${violation.message}`,
    );
  }
  process.exitCode = 1;
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : undefined;
if (invokedPath === fileURLToPath(import.meta.url)) {
  run();
}
