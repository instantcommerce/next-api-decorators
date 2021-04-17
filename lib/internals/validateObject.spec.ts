import 'reflect-metadata';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import * as lp from './loadPackage';
import { validateObject } from './validateObject';

describe('validateObject', () => {
  it('Should return the value (and log a warning) if "class-validator" is not being used.', async () => {
    const spyLp = jest
      .spyOn(lp, 'loadPackage')
      .mockImplementation((name: string) => (name === 'class-validator' ? false : require(name)));

    const spyConsole = jest.spyOn(console, 'warn').mockImplementation();

    class Dto {
      @IsNotEmpty()
      public email!: string;
    }

    const result = await validateObject(Dto, { secondaryEmail: 'dev@storyofams.com' });

    expect(result).toHaveProperty('secondaryEmail', 'dev@storyofams.com');
    expect(spyConsole).toHaveBeenCalledWith(expect.stringMatching(/class-validator/));

    spyLp.mockRestore();
    spyConsole.mockRestore();
  });

  it('Should return the value (and log a warning) if "class-transformer" is not being used.', async () => {
    const spyLp = jest
      .spyOn(lp, 'loadPackage')
      .mockImplementation((name: string) => (name === 'class-transformer' ? false : require(name)));

    const spyConsole = jest.spyOn(console, 'warn').mockImplementation();

    class Dto {
      @IsNotEmpty()
      public email!: string;
    }

    const result = await validateObject(Dto, { secondaryEmail: 'dev@storyofams.com' });

    expect(result).toHaveProperty('secondaryEmail', 'dev@storyofams.com');
    expect(spyConsole).toHaveBeenCalledWith(expect.stringMatching(/class-transformer/));

    spyLp.mockRestore();
    spyConsole.mockRestore();
  });

  it('Should return only exposed properties.', async () => {
    class Dto {
      @Expose()
      @IsNotEmpty()
      public email!: string;
    }

    const result = await validateObject(
      Dto,
      { email: 'dev@storyofams.com', secondaryEmail: 'hello@storyofams.com' },
      {
        transformOptions: { excludeExtraneousValues: true }
      }
    );

    expect(result).toHaveProperty('email', 'dev@storyofams.com');
    expect(result).not.toHaveProperty('secondaryEmail', 'hello@storyofams.com');
  });
});
