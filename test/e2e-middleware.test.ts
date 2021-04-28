import 'reflect-metadata';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import { NextApiResponse } from 'next';
import responseTime from 'response-time';
import request from 'supertest';
import { createHandler, Post, UseBefore, UploadedFile, UploadedFiles, UseAfter, Get, Res } from '../lib';
import { setupServer } from './setupServer';

const upload = multer({ storage: multer.memoryStorage() });
const rateLimiter = rateLimit({ max: 1 });

const messages: string[] = [];

@UseAfter(
  // eslint-disable-next-line @typescript-eslint/ban-types
  (_: any, __: any, next: Function) => {
    messages.push('Request lifecycle ended.');
    next();
  }
)
@UseBefore(responseTime())
class TestHandler {
  @Get('/dashboard')
  public dashboard(@Res() res: NextApiResponse): NextApiResponse | Record<string, any> {
    if (messages.includes('logged-in')) {
      return { message: 'Hello!' };
    }

    return res.redirect(307, 'login');
  }

  @Get('/login')
  public login(@Res() res: NextApiResponse): NextApiResponse | Record<string, any> {
    if (messages.includes('logged-in')) {
      return res.redirect('/');
    }

    messages.push('logged-in');
    return { message: 'Logging in...' };
  }

  @Post('/single')
  @UseBefore(rateLimiter)
  @UseBefore(upload.single('file'))
  public upload(@UploadedFile() file: Express.Multer.File): Record<string, any> {
    return { filename: file.originalname };
  }

  @Post('/multiple')
  @UseBefore(upload.array('files', 2))
  public multiple(@UploadedFiles() files: Express.Multer.File[]): Record<string, any> {
    return {
      count: files.length,
      files: files.map(f => f.originalname)
    };
  }

  @Post('/fields')
  @UseBefore(
    upload.fields([
      { name: 'file1', maxCount: 1 },
      { name: 'file2', maxCount: 1 }
    ])
  )
  public fields(@UploadedFiles() files: Record<string, Express.Multer.File[]>): Record<string, any> {
    const file1 = files.file1[0];
    const file2 = files.file2[0];

    return {
      file1: file1.originalname,
      file2: file2.originalname
    };
  }
}

describe('E2E - Middleware', () => {
  let server: ReturnType<typeof setupServer>;
  beforeAll(() => (server = setupServer(createHandler(TestHandler), true)));
  afterAll(() => {
    if ('close' in server && typeof server.close === 'function') {
      server.close();
    }
  });

  it('Should upload the file', () =>
    request(server)
      .post('/api/test/single')
      .attach('file', Buffer.from('hello world!'), { contentType: 'text/plain', filename: 'hello.txt' })
      .expect(200, { filename: 'hello.txt' })
      .then(res => expect(res.headers).toHaveProperty('x-response-time')));

  it('Should rate limit', () =>
    request(server)
      .post('/api/test/single')
      .attach('file', Buffer.from('hello world!'), { contentType: 'text/plain', filename: 'hello.txt' })
      .expect(429, 'Too many requests, please try again later.')
      .then(res => expect(res.headers).toHaveProperty('x-response-time')));

  it('Should upload multiple files.', () =>
    request(server)
      .post('/api/test/multiple')
      .attach('files', Buffer.from('hello world!'), { contentType: 'text/plain', filename: 'hello.txt' })
      .attach('files', Buffer.from('hello world!'), { contentType: 'text/plain', filename: 'hello.txt' })
      .expect(200, { count: 2, files: ['hello.txt', 'hello.txt'] }));

  it('Should fail for maxCount upload multiple files.', () =>
    request(server)
      .post('/api/test/multiple')
      .attach('files', Buffer.from('hello world!'), { contentType: 'text/plain', filename: 'hello.txt' })
      .attach('files', Buffer.from('hello world!'), { contentType: 'text/plain', filename: 'hello.txt' })
      .attach('files', Buffer.from('hello world!'), { contentType: 'text/plain', filename: 'hello.txt' })
      .expect(400)
      .then(res =>
        expect(res.body).toMatchObject({
          statusCode: 400,
          message: 'Unexpected field: "files"'
        })
      ));

  it('Should upload files in different fields.', () =>
    request(server)
      .post('/api/test/fields')
      .attach('file1', Buffer.from('hello 1st world!'), { contentType: 'text/plain', filename: 'hello1.txt' })
      .attach('file2', Buffer.from('hello 2nd world!'), { contentType: 'text/plain', filename: 'hello2.txt' })
      .expect(200, {
        file1: 'hello1.txt',
        file2: 'hello2.txt'
      }));

  it('Should fail for multiple files in different fields.', () =>
    request(server)
      .post('/api/test/fields')
      .attach('file1', Buffer.from('hello 1st world!'), { contentType: 'text/plain', filename: 'hello1.txt' })
      .attach('file1', Buffer.from('hello 1st world!'), { contentType: 'text/plain', filename: 'hello11.txt' })
      .attach('file2', Buffer.from('hello 2nd world!'), { contentType: 'text/plain', filename: 'hello2.txt' })
      .attach('file2', Buffer.from('hello 2nd world!'), { contentType: 'text/plain', filename: 'hello22.txt' })
      .expect(400)
      .then(res => {
        expect(res.body).toMatchObject({
          statusCode: 400,
          message: 'Unexpected field: "file1"'
        });
        expect(messages).toContain('Request lifecycle ended.');
      }));

  it('Should redirect properly.', async () => {
    const res = await request(server).get('/api/test/dashboard');

    expect(res.status).toStrictEqual(307);
    expect(res.headers).toHaveProperty('location', 'login');

    const loginRes = await request(server).get(`/api/test/${res.headers['location']}`);

    expect(loginRes.status).toStrictEqual(200);
    expect(loginRes.body).toStrictEqual({ message: 'Logging in...' });

    const dashboardRes = await request(server).get('/api/test/dashboard');
    expect(dashboardRes.status).toStrictEqual(200);
    expect(dashboardRes.body).toStrictEqual({ message: 'Hello!' });
  });
});
