import type { ClassConstructor } from 'class-transformer';
import { BadRequestException } from '../exceptions';
import type { ValidationPipeOptions } from '../pipes';
import { flattenValidationErrors } from './getClassValidatorError';
import { loadPackage } from './loadPackage';

export async function validateObject(
  cls: ClassConstructor<any>,
  value: Record<string, string>,
  validatorOptions?: ValidationPipeOptions
): Promise<any> {
  const classValidator = loadPackage('class-validator');
  if (!classValidator) {
    console.warn('[validateObject] Missing package `class-validator`.');
    console.warn('More information: https://github.com/storyofams/next-api-decorators#data-transfer-object');
    return value;
  }

  const classTransformer = loadPackage('class-transformer');
  if (!classTransformer) {
    console.warn('[validateObject] Missing package `class-transformer`.');
    console.warn('More information: https://github.com/storyofams/next-api-decorators#data-transfer-object');
    return value;
  }

  const bodyValue = classTransformer.plainToClass(cls, value, {
    enableImplicitConversion: true,
    ...validatorOptions?.transformOptions
  });
  const validationErrors = await classValidator.validate(bodyValue, {
    enableDebugMessages: process.env.NODE_ENV === 'development',
    ...validatorOptions
  });

  if (validationErrors.length) {
    const flattenedErrors = flattenValidationErrors(validationErrors);
    throw new BadRequestException(flattenedErrors[0], flattenedErrors);
  }

  return bodyValue;
}
