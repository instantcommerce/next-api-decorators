import * as cp from '../../internals/checkPackage';
import { ValidationPipe } from './validation.pipe';

describe('ValidationPipe', () => {
  it('Should check if "class-validator" and "class-transformer" are installed.', async () => {
    const spy = jest.spyOn(cp, 'checkPackage').mockImplementation();

    ValidationPipe();

    expect(spy).toHaveBeenCalledWith('class-validator', 'ValidationPipe', expect.stringContaining('https://'));
    expect(spy).toHaveBeenCalledWith('class-transformer', 'ValidationPipe', expect.stringContaining('https://'));

    spy.mockRestore();
  });

  it('Should return the value as is when there is no meta type defined.', () =>
    expect(ValidationPipe()({ firstName: 'Uncle', lastName: 'Bob' })).toMatchObject({
      firstName: 'Uncle',
      lastName: 'Bob'
    }));
});
