import 'reflect-metadata';

import { z } from 'zod';
import { createZodDto } from './createZodDto';
import * as lp from './loadPackage';
import { validateZodSchema } from './validateZodSchema';

describe('validateObject', () => {
  it('Should return the value if "class-validator" is not being used.', async () => {
    const spy = jest
      .spyOn(lp, 'loadPackage')
      .mockImplementation((name: string) => (name === 'zod' ? false : require(name)));

    const dtoSchema = z.object({
      email: z.string()
    });

    class Dto extends createZodDto(dtoSchema) {}

    const result = await validateZodSchema(Dto, { secondaryEmail: 'dev@instantcommerce.io' });

    expect(result).toHaveProperty('secondaryEmail', 'dev@instantcommerce.io');

    spy.mockRestore();
  });

  it('Should return only exposed properties.', async () => {
    const dtoSchema = z.object({
      email: z.string()
    });

    class Dto extends createZodDto(dtoSchema) {}

    const result = await validateZodSchema(Dto, {
      email: 'dev@instantcommerce.io',
      secondaryEmail: 'hello@instantcommerce.io'
    });

    expect(result).toHaveProperty('email', 'dev@instantcommerce.io');
    expect(result).not.toHaveProperty('secondaryEmail', 'hello@instantcommerce.io');
  });
});
