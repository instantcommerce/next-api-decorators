import type { Stream } from 'stream';

export interface DownloadFileResult {
  filename: string;
  contents: Stream | Buffer | string;
  contentType?: string;
}
