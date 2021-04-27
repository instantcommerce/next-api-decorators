interface LoadPackageWarning {
  context: string;
  docsUrl: string;
}

export function loadPackage(name: string, warning?: LoadPackageWarning): any {
  try {
    return require(name);
  } catch {
    if (warning) {
      console.warn(`[${warning.context}] Missing required package "${name}".`);
      console.warn(`[${warning.context}] More information: ${warning.docsUrl}`);
    }

    return false;
  }
}
