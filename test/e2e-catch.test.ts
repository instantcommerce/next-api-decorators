import { NextApiRequest, NextApiResponse } from 'next';
import 'reflect-metadata';
import request from 'supertest';
import {
  createHandler,
  Get,
  UnauthorizedException,
  NotFoundException,
  Query,
  UseMiddleware,
  ParseNumberPipe,
  BadRequestException,
  Catch,
  NextFunction
} from '../lib';
import { setupServer } from './setupServer';

const ARTICLES = [
  { id: 1, title: 'Hello world example' },
  { id: 2, title: 'Handling errors' },
  { id: 3, title: 'Validation' }
];

function unauthorizedExceptionHandler(error: UnauthorizedException, _req: NextApiRequest, res: NextApiResponse): void {
  res.status(200).json({ error: true, errorMessage: error.message });
}

async function notFoundExceptionHandler(
  exception: NotFoundException,
  _req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  await new Promise<void>(resolve => setTimeout(resolve, 250));
  res.status(200).json({ notFound: true, message: exception.message });
}

function generalExceptionHandler(error: Error, _req: NextApiRequest, res: NextApiResponse): void {
  res.status(500).json({ error: true, name: error.name, msg: error.message });
}

function exceptionHandlerToAvoid(_error: Error, _req: NextApiRequest, res: NextApiResponse): void {
  res.status(204).end();
}

@Catch(unauthorizedExceptionHandler, UnauthorizedException)
@Catch(notFoundExceptionHandler, NotFoundException)
class ArticleHandler {
  @Get()
  @UseMiddleware((req: NextApiRequest, _res: NextApiResponse, next: NextFunction) => {
    if (req.query.protected === 'true') {
      throw new UnauthorizedException();
    }

    next();
  })
  public index(@Query('search') search?: string) {
    switch (search) {
      case 'forbidden-keyword':
        throw new NotFoundException();
      case 'another-forbidden-keyword':
        throw new BadRequestException();
    }

    return ARTICLES.filter(({ title }) => (search ? title.includes(search.toLowerCase()) : true));
  }

  @Get('/details')
  @Catch(generalExceptionHandler)
  @Catch(exceptionHandlerToAvoid) // `generalExceptionHandler` handles the error, since that's the first one. Therefore, this one gets ignored.
  public details(@Query('id', ParseNumberPipe) id: number) {
    const article = ARTICLES.find(article => article.id === id);
    if (!article) {
      throw new Error('Article not found');
    }

    return article;
  }
}

describe('E2E - Catch decorator', () => {
  let server: ReturnType<typeof setupServer>;
  beforeAll(() => {
    server = setupServer(createHandler(ArticleHandler));
  });

  afterAll(() => {
    if ('close' in server && typeof server.close === 'function') {
      server.close();
    }
  });

  it('Should return the articles.', () => request(server).get('/api/article').expect(200, ARTICLES));

  it('Should handle the error via the "notFoundExceptionHandler".', () =>
    request(server).get('/api/article?search=forbidden-keyword').expect(200, { notFound: true, message: 'Not Found' }));

  it('Should handle the error via the "unauthorizedExceptionHandler".', () =>
    request(server).get('/api/article?protected=true').expect(200, {
      error: true,
      errorMessage: 'Unauthorized'
    }));

  it('Should handle the error via the built-in error handler.', () =>
    request(server)
      .get('/api/article?search=another-forbidden-keyword')
      .expect(400, { statusCode: 400, message: 'Bad Request', errors: ['Bad Request'] }));

  it('Should return the article.', () => request(server).get('/api/article/details?id=1').expect(200, ARTICLES[0]));

  it('Should handle the error via the "generalExceptionHandler".', () =>
    request(server).get('/api/article/details?id=99999').expect(500, {
      error: true,
      name: 'Error',
      msg: 'Article not found'
    }));

  it('Should handle the pipe errors via the "generalExceptionHandler".', () =>
    request(server)
      .get('/api/article/details')
      .expect(500, { error: true, name: 'BadRequestException', msg: 'id is a required parameter.' }));
});
