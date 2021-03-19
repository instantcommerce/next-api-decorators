export const HTTP_DOWNLOAD_TOKEN = Symbol('ams:next:download');

/**
 * Marks the method as a download handler for the client, so the returned file can be downloaded by the browser.
 *
 * @remarks
 * The method has to return an object with specific fields for the internal handler to insert the necessary headers and return the file contents to the browser to download.
 *
 * The return type must comply with the following interface:
 *
 * ```ts
 * interface DownloadFileResult {
 *  filename: string;
 *  contents: Stream | Buffer | string;
 *  contentType?: string
 * }
 * ```
 */
export function Download(): MethodDecorator {
  return function (target: object, propertyKey: string | symbol) {
    Reflect.defineMetadata(HTTP_DOWNLOAD_TOKEN, true, target.constructor, propertyKey);
  };
}
