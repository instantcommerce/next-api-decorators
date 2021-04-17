export function loadPackage(name: string, context: string): any {
  try {
    return require(name);
  } catch {
    console.warn(`[${context}] Failed to load package "${name}".`);
    return false;
  }
}
