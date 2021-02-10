export function ParseBooleanPipe(value: any): boolean {
  return typeof value === 'string' && (value === 'true' || value === 'false')
    ? value.toLowerCase().trim() === 'true'
    : value;
}
