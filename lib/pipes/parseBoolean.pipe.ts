import { BadRequestException } from '../exceptions';

export function ParseBooleanPipe(value: any): boolean {
  if (value === true || value === 'true') {
    return true;
  }

  if (value === false || value === 'false') {
    return false;
  }

  throw new BadRequestException('Validation failed (boolean string is expected)');
}
