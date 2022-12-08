import { UnprocessableEntityException } from '../../exceptions';
import { loadPackage } from '../../internals/loadPackage';
import { ZodDtoStatic } from '../../internals/validateZodSchema';
import { ParameterPipe, PipeMetadata } from '../ParameterPipe';

/**
 * Validates request body values and gets them as DTOs.
 *
 * @remarks
 * `zod` needs to be installed.
 * More information: [data transfer object](https://next-api-decorators.vercel.app/docs/validation)
 */
export function ZodValidationPipe(): ParameterPipe<any> {
  if (process.env.NODE_ENV === 'development')
    (['zod'] as const).forEach(requiredPackage =>
      loadPackage(requiredPackage, {
        context: 'ZodValidationPipe',
        docsUrl: 'https://next-api-decorators.vercel.app/docs/validation'
      })
    );

  return (value: any, metadata?: PipeMetadata) => {
    if (!metadata?.metaType) return value;

    const zodSchema = (metadata.metaType as ZodDtoStatic<unknown>)?.zodSchema;

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
}
