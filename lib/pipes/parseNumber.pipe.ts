export function ParseNumberPipe(value: any): number {
  return !Number.isNaN(value) && !Number.isNaN(Number.parseFloat(value)) ? parseFloat(value) : value;
}
