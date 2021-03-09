import { BadRequestException } from '../../exceptions';
import type { ParameterPipe, PipeOptions, PipeMetadata } from '../ParameterPipe';
import { validatePipeOptions } from '../validatePipeOptions';

interface ValidateEnumPipeOptions<T extends Record<string, unknown>> extends PipeOptions {
  type: T;
}

export function ValidateEnumPipe<T extends Record<string, unknown>>(
  options?: ValidateEnumPipeOptions<T>
): ParameterPipe<number> {
  return (value: any, metadata?: PipeMetadata) => {
    validatePipeOptions(value, metadata?.name, options);

    if (value && options?.type) {
      const values = Object.values(options.type);
      if (!values.includes(value)) {
        throw new BadRequestException(
          `Validation failed${metadata?.name ? ` for ${metadata.name}` : ''} (expected one of the values: ${values.join(
            ', '
          )})`
        );
      }
    }

    return value;
  };
}
