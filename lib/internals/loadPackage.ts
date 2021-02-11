export function loadPackage(name: string): any {
  try {
    return require(name);
  } catch {
    return false;
  }
}
