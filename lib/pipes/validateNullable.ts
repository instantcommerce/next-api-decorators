export function validateNullable(value: any, nullable?: boolean): boolean {
  return !!nullable && value == null;
}
