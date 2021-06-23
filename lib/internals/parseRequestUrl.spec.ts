import { parseRequestUrl } from './parseRequestUrl';

describe('parseRequestUrl', () => {
  it('Should return "/"', () => {
    expect(parseRequestUrl('/api/user')).toStrictEqual('/');
  });

  it('Should return "/1"', () => {
    expect(parseRequestUrl('/api/user/1')).toStrictEqual('/1');
  });

  it('Should return "/1/articles"', () => {
    expect(parseRequestUrl('/api/user/1/articles')).toStrictEqual('/1/articles');
  });

  it('Should return "/" when directory name is a paremeter ([id])', () =>
    expect(parseRequestUrl('/api/user/1', '/next-api-decorators/.next/server/pages/api/user/[id]')).toStrictEqual('/'));

  it('Should return "/articles" when directory name is a paremeter ([id])', () =>
    expect(
      parseRequestUrl('/api/user/1/articles', '/next-api-decorators/.next/server/pages/api/user/[id]')
    ).toStrictEqual('/articles'));
});
