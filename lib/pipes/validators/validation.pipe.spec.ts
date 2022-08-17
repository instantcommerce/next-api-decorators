import { IsEmail, IsNotEmpty } from 'class-validator';
import { BadRequestException } from '../../exceptions';
import * as lp from '../../internals/loadPackage';
import { ValidationPipe } from './validation.pipe';

describe('ValidationPipe', () => {
  const ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ENV };
  });

  afterAll(() => {
    process.env = ENV;
  });

  it('Should check if "class-validator" and "class-transformer" are installed.', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    process.env.NODE_ENV = 'development';

    const spy = jest.spyOn(lp, 'loadPackage');

    ValidationPipe();

    expect(spy).toHaveBeenCalledWith('class-validator', {
      context: 'ValidationPipe',
      docsUrl: expect.stringContaining('https://')
    });
    expect(spy).toHaveBeenCalledWith('class-transformer', {
      context: 'ValidationPipe',
      docsUrl: expect.stringContaining('https://')
    });
  });

  it('Should return the value as is when there is no meta type defined.', () =>
    expect(ValidationPipe()({ firstName: 'Uncle', lastName: 'Bob' })).toMatchObject({
      firstName: 'Uncle',
      lastName: 'Bob'
    }));

  it('Should throw for an "undefined" body.', () => {
    class DTO {
      @IsNotEmpty()
      @IsEmail()
      public email!: string;

      @IsNotEmpty()
      public name!: string;
    }

    expect(ValidationPipe()(undefined, { metaType: DTO })).rejects.toThrowError(BadRequestException);
  });

  it('Should throw for an empty string body.', () => {
    class DTO {
      @IsNotEmpty()
      @IsEmail()
      public email!: string;

      @IsNotEmpty()
      public name!: string;
    }

    expect(ValidationPipe()('', { metaType: DTO })).rejects.toThrowError(BadRequestException);
  });

  it('Should throw for a stringified JSON body.', () => {
    class DTO {
      @IsNotEmpty()
      @IsEmail()
      public email!: string;

      @IsNotEmpty()
      public name!: string;
    }

    expect(
      ValidationPipe()('{"email":"hello@instantcommerce.io","name":"Hello world"}', { metaType: DTO })
    ).rejects.toThrowError(BadRequestException);
  });
});
