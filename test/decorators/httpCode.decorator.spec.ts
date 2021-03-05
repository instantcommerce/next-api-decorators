import 'reflect-metadata';
import { HttpCode, HTTP_CODE_TOKEN } from '../../lib/decorators';

class Test {
  @HttpCode(201)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public create(): void {}
}

it('HttpCode decorator should be set.', () =>
  expect(Reflect.getMetadata(HTTP_CODE_TOKEN, Test, 'create')).toStrictEqual(201));
