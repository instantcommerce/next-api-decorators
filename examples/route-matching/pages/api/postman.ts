import fs from 'fs';
import {
  Get,
  Download,
  DownloadFileResult,
  createHandler,
} from 'next-api-decorators';

class Postman {
  private pathToFile = `${process.cwd()}/postman.json`;
  private filename = `next-api-decorators-postman.json`;

  // GET /api/postman
  @Get()
  @Download()
  public async downloadCollection(): Promise<DownloadFileResult> {
    const stream = fs.createReadStream(this.pathToFile);

    return {
      filename: this.filename,
      contents: stream,
      contentType: 'application/json',
    };
  }
}

export default createHandler(Postman);
