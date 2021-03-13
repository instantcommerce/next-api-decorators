/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import { HEADER_TOKEN, SetHeader } from './setHeader.decorator';

@SetHeader('X-Api', 'true')
class Test {
  @SetHeader('X-Method', 'index')
  public index(): void {}
}

it('Should set the SetHeader decorator for the given name.', () => {
  const meta = Reflect.getMetadata(HEADER_TOKEN, Test);
  const methodMeta = Reflect.getMetadata(HEADER_TOKEN, Test, 'index');

  expect(meta).toBeInstanceOf(Map);
  expect(methodMeta).toBeInstanceOf(Map);

  expect(meta).toMatchObject(new Map([['X-Api', 'true']]));
  expect(methodMeta).toMatchObject(new Map([['X-Method', 'index']]));
});
