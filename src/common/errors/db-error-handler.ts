import { Error as MongooseError } from 'mongoose';
import {
  DatabaseError,
  DuplicateEntityError,
  InvalidInputError,
} from './domain-errors';

interface DuplicateKeyError {
  code: 11000;
  keyValue: Record<string, unknown>;
}

function isDuplicateKeyError(error: unknown): error is DuplicateKeyError {
  return (error as DuplicateKeyError).code === 11000;
}

export function handleDbError(error: unknown, operation?: string): never {
  if (error instanceof MongooseError.ValidationError) {
    const messages = Object.values(error.errors).map((e) => e.message);
    throw new InvalidInputError(messages.join('; '));
  }

  if (error instanceof MongooseError.CastError) {
    throw new InvalidInputError(`Invalid ${error.path}: ${error.value}`);
  }

  if (isDuplicateKeyError(error)) {
    const field = Object.keys(error.keyValue)[0];
    throw new DuplicateEntityError(field, error.keyValue[field]);
  }

  throw new DatabaseError(operation ?? 'unknown');
}
