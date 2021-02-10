import { ParseBooleanPipe } from './parseBoolean.pipe';
import { ParseNumberPipe } from './parseNumber.pipe';

export function applyInternalPipes(value: any): number | boolean {
  return ParseNumberPipe(ParseBooleanPipe(value));
}
