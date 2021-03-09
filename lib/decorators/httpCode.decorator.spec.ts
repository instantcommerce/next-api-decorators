import 'reflect-metadata';
import { HttpCode, HTTP_CODE_TOKEN } from './httpCode.decorator';

class Test {
  @HttpCode(201)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public create(): void {}
}

it('Should set the HttpCode decorator.', () =>
  expect(Reflect.getMetadata(HTTP_CODE_TOKEN, Test, 'create')).toStrictEqual(201));
