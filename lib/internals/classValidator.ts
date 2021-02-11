import type { ClassConstructor } from 'class-transformer';
import { BadRequestException } from '../exceptions';
import { flattenValidationErrors } from './getClassValidatorError';
import { loadPackage } from './loadPackage';

export async function validateObject(cls: ClassConstructor<any>, value: Record<string, string>): Promise<any> {
  const classValidator = loadPackage('class-validator');
  if (!classValidator) {
    return value;
  }

  const classTransformer = loadPackage('class-transformer');
  if (!classTransformer) {
    return value;
  }

  const bodyValue = classTransformer.plainToClass(cls, value, {
    enableImplicitConversion: true
  });
  const validationErrors = await classValidator.validate(bodyValue, {
    enableDebugMessages: process.env.NODE_ENV === 'development'
  });

  if (validationErrors.length) {
    const flattenedErrors = flattenValidationErrors(validationErrors);
    throw new BadRequestException(flattenedErrors[0], flattenedErrors);
  }

  return bodyValue;
}
