import * as lp from '../../internals/loadPackage';
import { ValidationPipe } from './validation.pipe';

describe('ValidationPipe', () => {
  const ENV = process.env;

  beforeEach(() => {
    // Clear cache
    jest.resetModules();
    process.env = { ...ENV };
  });

  afterAll(() => {
    // Restore env
    process.env = ENV;
  });

  it('Should check if "class-validator" and "class-transformer" are installed.', async () => {
    process.env.NODE_ENV = 'development';

    const spy = jest.spyOn(lp, 'loadPackage').mockImplementation();

    ValidationPipe();

    expect(spy).toHaveBeenCalledWith('class-validator', {
      context: 'ValidationPipe',
      docsUrl: expect.stringContaining('https://')
    });
    expect(spy).toHaveBeenCalledWith('class-transformer', {
      context: 'ValidationPipe',
      docsUrl: expect.stringContaining('https://')
    });

    spy.mockRestore();
  });

  it('Should return the value as is when there is no meta type defined.', () =>
    expect(ValidationPipe()({ firstName: 'Uncle', lastName: 'Bob' })).toMatchObject({
      firstName: 'Uncle',
      lastName: 'Bob'
    }));
});
