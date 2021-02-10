/**
 * Functions below are taken from Nest.js and modify where necessary to satisfy the needs of this package.
 *
 * https://github.com/nestjs/nest
 */

import type { ValidationError } from 'class-validator';

function prependConstraintsWithParentProp(parentPath: string, error: ValidationError): ValidationError {
  const constraints: Record<string, any> = {};
  for (const key in error.constraints) {
    constraints[key] = `${parentPath}.${error.constraints[key]}`;
  }
  return {
    ...error,
    constraints
  };
}

function mapChildrenToValidationErrors(error: ValidationError, parentPath?: string): ValidationError[] {
  if (!(error.children && error.children.length)) {
    return [error];
  }
  const validationErrors = [];
  parentPath = parentPath ? `${parentPath}.${error.property}` : error.property;
  for (const item of error.children) {
    if (item.children && item.children.length) {
      validationErrors.push(...mapChildrenToValidationErrors(item, parentPath));
    }
    validationErrors.push(prependConstraintsWithParentProp(parentPath, item));
  }
  return validationErrors;
}

export function flattenValidationErrors(validationErrors: ValidationError[]): string[] {
  return validationErrors
    .flatMap(error => mapChildrenToValidationErrors(error))
    .filter((item: ValidationError) => !!item.constraints)
    .flatMap((item: ValidationError) => Object.values(item.constraints ?? {}));
}
