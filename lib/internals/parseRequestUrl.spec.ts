import { parseRequestUrl } from './parseRequestUrl';

describe('parseRequestUrl', () => {
  it('Should return "/"', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(parseRequestUrl({ url: '/api/user' })).toStrictEqual('/');
  });

  it('Should return "/1"', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(parseRequestUrl({ url: '/api/user/1' })).toStrictEqual('/1');
  });

  it('Should return "/1/articles"', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(parseRequestUrl({ url: '/api/user/1/articles' })).toStrictEqual('/1/articles');
  });

  it('Should return "/" when directory name is a paremeter ([id])', () =>
    expect(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      parseRequestUrl({ url: '/api/user/1' }, '/next-api-decorators/.next/server/pages/api/user/[id]')
    ).toStrictEqual('/'));

  it('Should return "/articles" when directory name is a paremeter ([id])', () =>
    expect(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      parseRequestUrl({ url: '/api/user/1/articles' }, '/next-api-decorators/.next/server/pages/api/user/[id]')
    ).toStrictEqual('/articles'));

  it('Should return "/" when the file name is "articles.js" which gets compiled from "articles/index.ts"', () =>
    expect(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      parseRequestUrl({ url: '/api/articles' }, '/next-api-decorators/.next/server/pages/api', 'articles.js')
    ).toStrictEqual('/'));

  it('Should return "/" when the file name starts with "[..."', () =>
    expect(
      parseRequestUrl(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        { url: '/api/article/1', query: { id: '1' } },
        '/next-api-decorators/.next/server/pages/api/article',
        '[...id].js'
      )
    ).toStrictEqual('/'));
});
