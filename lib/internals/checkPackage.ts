export function checkPackage(name: string, context: string, docsUrl: string): void {
  try {
    require(name);
  } catch {
    console.warn(`[${context}] Missing required package "${name}".`);
    console.warn(`[${context}] More information: ${docsUrl}`);
  }
}
