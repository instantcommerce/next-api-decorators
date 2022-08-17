import 'reflect-metadata';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import * as lp from './loadPackage';
import { validateObject } from './validateObject';

describe('validateObject', () => {
  it('Should return the value if "class-validator" is not being used.', async () => {
    const spy = jest
      .spyOn(lp, 'loadPackage')
      .mockImplementation((name: string) => (name === 'class-validator' ? false : require(name)));

    class Dto {
      @IsNotEmpty()
      public email!: string;
    }

    const result = await validateObject(Dto, { secondaryEmail: 'dev@instantcommerce.io' });

    expect(result).toHaveProperty('secondaryEmail', 'dev@instantcommerce.io');

    spy.mockRestore();
  });

  it('Should return the value if "class-transformer" is not being used.', async () => {
    const spy = jest
      .spyOn(lp, 'loadPackage')
      .mockImplementation((name: string) => (name === 'class-transformer' ? false : require(name)));

    class Dto {
      @IsNotEmpty()
      public email!: string;
    }

    const result = await validateObject(Dto, { secondaryEmail: 'dev@instantcommerce.io' });

    expect(result).toHaveProperty('secondaryEmail', 'dev@instantcommerce.io');

    spy.mockRestore();
  });

  it('Should return only exposed properties.', async () => {
    class Dto {
      @Expose()
      @IsNotEmpty()
      public email!: string;
    }

    const result = await validateObject(
      Dto,
      { email: 'dev@instantcommerce.io', secondaryEmail: 'hello@instantcommerce.io' },
      {
        transformOptions: { excludeExtraneousValues: true }
      }
    );

    expect(result).toHaveProperty('email', 'dev@instantcommerce.io');
    expect(result).not.toHaveProperty('secondaryEmail', 'hello@instantcommerce.io');
  });
});
