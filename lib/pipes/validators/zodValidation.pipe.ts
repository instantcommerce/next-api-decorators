import type { ZodDtoStatic } from '../../internals/createZodDto';
import { loadPackage } from '../../internals/loadPackage';
import { validateZodSchema } from '../../internals/validateZodSchema';
import { ParameterPipe, PipeMetadata } from '../ParameterPipe';

// re-export createZodDto to make it available under `next-api-decorators`
export { createZodDto } from '../../internals/createZodDto';

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

    return validateZodSchema(metadata.metaType as ZodDtoStatic<unknown>, value);
  };
}
