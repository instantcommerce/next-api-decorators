import 'next';

declare module 'next' {
  interface NextApiRequest {
    params: Record<string, any>;

    /** `Multer.File` object populated by `single()` middleware. */
    file: Express.Multer.File;

    /**
     * Array or dictionary of `Multer.File` object populated by `array()`,
     * `fields()`, and `any()` middleware.
     */
    files:
      | {
          [fieldname: string]: Express.Multer.File[];
        }
      | Express.Multer.File[];
  }
}
