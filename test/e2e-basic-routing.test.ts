import 'reflect-metadata';
import request from 'supertest';
import { createHandler, Get, Param, ParseNumberPipe } from '../lib';
import * as lp from '../lib/internals/loadPackage';
import { setupServer } from './setupServer';

const ARTICLES = [
  { id: 1, title: 'Article 1' },
  { id: 2, title: 'Article 2' }
];
const COMMENTS = [{ text: 'Comment 1' }, { text: 'Comment 2' }];

class ArticleHandler {
  @Get('/')
  public articles(): Record<string, any>[] {
    return ARTICLES;
  }

  @Get('/:id(\\d+)')
  public article(@Param('id', ParseNumberPipe) id: number) {
    return ARTICLES.find(article => article.id === id);
  }

  @Get('/comments')
  public articleComments(): Record<string, any>[] {
    return COMMENTS;
  }

  @Get('/comments/favorites')
  public favoriteArticleComments(): Record<string, any>[] {
    return [COMMENTS[0]];
  }
}

describe('E2E - Basic routing', () => {
  let server: ReturnType<typeof setupServer>;
  beforeAll(() => (server = setupServer(createHandler(ArticleHandler))));
  afterAll(() => {
    if ('close' in server && typeof server.close === 'function') {
      server.close();
    }
  });

  it('Should execute "articles".', () => request(server).get('/api/articles').expect(200, ARTICLES));

  it('Should execute "article".', () => request(server).get('/api/articles/1').expect(200, ARTICLES[0]));

  it('Should execute "articleComments".', () => request(server).get('/api/articles/comments').expect(200, COMMENTS));

  it('Should execute "favoriteArticleComments".', () =>
    request(server).get('/api/articles/comments/favorites').expect(200, [COMMENTS[0]]));
});

describe('E2E - Basic routing (without "path-to-regexp")', () => {
  let server: ReturnType<typeof setupServer>;
  beforeAll(() => {
    jest
      .spyOn(lp, 'loadPackage')
      .mockImplementation((name: string) => (name === 'path-to-regexp' ? false : require(name)));

    server = setupServer(createHandler(ArticleHandler));
  });
  afterAll(() => {
    jest.restoreAllMocks();

    if ('close' in server && typeof server.close === 'function') {
      server.close();
    }
  });

  it('Should execute "articles" when "path-to-regexp" is not installed.', () =>
    request(server).get('/api/articles').expect(200, ARTICLES));

  it('Should execute "articles" instead of "article" method when "path-to-regexp" is not installed.', () =>
    request(server).get('/api/articles/1').expect(200, ARTICLES));

  it('Should execute "articleComments" when "path-to-regexp" is not installed.', () =>
    request(server).get('/api/articles/comments').expect(200, COMMENTS));

  it('Should execute "favoriteArticleComments" when "path-to-regexp" is not installed.', () =>
    request(server).get('/api/articles/comments/favorites').expect(200, [COMMENTS[0]]));
});
