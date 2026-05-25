export class EntityNotFoundError extends Error {
  constructor(entity: string, id?: string) {
    super(id ? `${entity} not found: ${id}` : `${entity} not found`);
    this.name = 'EntityNotFoundError';
  }
}

export class DuplicateEntityError extends Error {
  constructor(field: string, value?: unknown) {
    super(value !== undefined ? `Duplicate ${field}: ${value}` : field);
    this.name = 'DuplicateEntityError';
  }
}

export class InvalidInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidInputError';
  }
}

export class DatabaseError extends Error {
  constructor(operation: string) {
    super(`Database error during ${operation}`);
    this.name = 'DatabaseError';
  }
}
