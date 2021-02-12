import { BadRequestException } from '../exceptions';
import type { PipeOptions } from './ParameterPipe';

export function validatePipeOptions(value: any, name?: string, options?: PipeOptions) {
  if (!options?.nullable && (value == null || value.toString().trim().length === 0)) {
    throw new BadRequestException(name ? `${name} is a required parameter.` : 'Missing a required parameter.');
  }
}
