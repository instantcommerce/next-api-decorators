import * as lp from '../../internals/loadPackage';
import { ValidationPipe } from './validation.pipe';

describe('ValidationPipe', () => {
  it('Should log a warning if "class-validator" or "class-transformer" is not being used.', async () => {
    const spyLp = jest
      .spyOn(lp, 'loadPackage')
      .mockImplementation((name: string) =>
        name === 'class-validator' || name === 'class-transformer' ? false : require(name)
      );

    const spyConsole = jest.spyOn(console, 'warn').mockImplementation();

    ValidationPipe();

    ['ValidationPipe', 'class-validator', 'class-transformer'].forEach(requiredWord =>
      expect(spyConsole).toHaveBeenCalledWith(expect.stringMatching(new RegExp(requiredWord)))
    );

    spyLp.mockRestore();
    spyConsole.mockRestore();
  });

  it('Should return the value as is when there is no meta type defined.', () =>
    expect(ValidationPipe()({ firstName: 'Uncle', lastName: 'Bob' })).toMatchObject({
      firstName: 'Uncle',
      lastName: 'Bob'
    }));
});
