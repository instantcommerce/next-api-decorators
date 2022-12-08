import { UnprocessableEntityException } from '../exceptions';
import type { ZodDtoStatic } from './createZodDto';
import { loadPackage } from './loadPackage';

export const validateZodSchema = (metaType: ZodDtoStatic<unknown>, value: string | Record<string, any>): any => {
  const zod = loadPackage('zod');
  if (!zod) {
    return value;
  }

  const zodSchema = metaType?.zodSchema;

  if (zodSchema) {
    const parseResult = zodSchema.safeParse(value);

    if (!parseResult.success) {
      const { error } = parseResult;
      const message = error.errors.map(error => `${error.path.join('.')}: ${error.message}`).join(', ');

      throw new UnprocessableEntityException(`Input validation failed: ${message}`);
    }

    return parseResult.data;
  }

  return value;
};
