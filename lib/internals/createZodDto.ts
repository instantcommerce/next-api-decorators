// credits: https://github.com/kbkk/abitia/blob/a7e8c2b231a9dab5425ae415edb46dd971c49b4a/packages/zod-dto/src/createZodDto.ts
import type { ZodType } from 'zod';

/**
 * ZodType is a very complex interface describing not just public properties but private ones as well
 * causing the interface to change fairly often among versions
 *
 * Since we're interested in the main subset of Zod functionality (type infering + parsing) this type is introduced
 * to achieve the most compatibility.
 */
export type CompatibleZodIssue = {
  message: string;
  path: (string | number)[];
};

export type CompatibleZodType = Pick<ZodType<unknown>, '_input' | '_output'> & {
  parse: (...args: any) => unknown;
  safeParse: (
    ...args: any
  ) =>
    | {
        success: true;
        data: unknown;
      }
    | {
        success: false;
        error: {
          issues: CompatibleZodIssue[];
          errors: CompatibleZodIssue[];
        };
      };
};

export type CompatibleZodInfer<T extends CompatibleZodType> = T['_output'];

export type ZodDtoStatic<T> = {
  new (): T;
  zodSchema: CompatibleZodType;
  create(input: unknown): T;
};

export const createZodDto = <T extends CompatibleZodType>(zodSchema: T): ZodDtoStatic<CompatibleZodInfer<T>> => {
  class SchemaHolderClass {
    public static zodSchema = zodSchema;

    public static create(input: unknown): T {
      return this.zodSchema.parse(input) as T;
    }
  }

  return SchemaHolderClass;
};
