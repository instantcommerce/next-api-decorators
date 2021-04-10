import type { ClassTransformOptions } from 'class-transformer';
import type { ValidatorOptions } from 'class-validator';
import { validateObject } from '../../internals/classValidator';
import type { ParameterPipe, PipeMetadata } from '../ParameterPipe';

export interface ValidationPipeOptions extends ValidatorOptions {
  /** Options for the `class-transformer` package. */
  transformOptions?: ClassTransformOptions;
}

export function ValidationPipe(options?: ValidationPipeOptions): ParameterPipe<any> {
  return (value: any, metadata?: PipeMetadata) => {
    if (!metadata?.metaType) {
      return value;
    }

    return validateObject(metadata?.metaType, value, options);
  };
}
