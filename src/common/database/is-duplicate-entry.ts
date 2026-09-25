import { QueryFailedError } from 'typeorm';

export function isDuplicateEntry(error: unknown): boolean {
  if (!(error instanceof QueryFailedError)) {
    return false;
  }

  const driverError = error.driverError as { errno?: number; code?: string };
  return driverError.errno === 1062 || driverError.code === 'ER_DUP_ENTRY';
}
