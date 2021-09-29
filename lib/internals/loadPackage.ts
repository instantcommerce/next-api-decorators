interface LoadPackageWarning {
  context: string;
  docsUrl: string;
}

type LoadablePackages = 'path-to-regexp' | 'class-validator' | 'class-transformer';

export function loadPackage(name: LoadablePackages, warning?: LoadPackageWarning): any {
  try {
    switch (name) {
      case 'path-to-regexp':
        return require('path-to-regexp');
      case 'class-transformer':
        return require('class-transformer');
      case 'class-validator':
        return require('class-validator');
      default:
        throw new Error('Invalid package name.');
    }
  } catch {
    if (warning) {
      console.warn(`[${warning.context}] Missing required package "${name}".`);
      console.warn(`[${warning.context}] More information: ${warning.docsUrl}`);
    }

    return false;
  }
}
