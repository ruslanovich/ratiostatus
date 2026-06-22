export interface BoundaryViolation {
  readonly filePath: string;
  readonly line: number;
  readonly column: number;
  readonly message: string;
}

export function findBoundaryViolations(
  filePath: string,
  sourceText: string,
): BoundaryViolation[];

export function checkImportBoundaries(
  repositoryRoot?: string,
): BoundaryViolation[];
