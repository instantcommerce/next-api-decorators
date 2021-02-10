import { BadRequestException } from '../exceptions';

export function ParseNumberPipe(value: any): number {
  const isNumeric = ['string', 'number'].includes(typeof value) && !isNaN(parseFloat(value)) && isFinite(value);
  if (!isNumeric) {
    throw new BadRequestException('Validation failed (numeric string is expected)');
  }
  return parseFloat(value);
}
