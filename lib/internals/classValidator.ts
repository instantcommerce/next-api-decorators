import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { BadRequestException } from '../exceptions';
import { flattenValidationErrors } from './getClassValidatorError';

export async function validateObject(cls: ClassConstructor<any>, value: Record<string, string>): Promise<any> {
  const bodyValue = plainToClass(cls, value, {
    enableImplicitConversion: true
  });
  const validationErrors = await validate(bodyValue, {
    enableDebugMessages: process.env.NODE_ENV === 'development'
  });

  if (validationErrors.length) {
    const flattenedErrors = flattenValidationErrors(validationErrors);
    throw new BadRequestException(flattenedErrors[0], flattenedErrors);
  }

  return bodyValue;
}
