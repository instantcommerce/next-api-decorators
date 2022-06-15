import 'next';
import { RequestMeta, NEXT_REQUEST_META } from 'next/dist/server/request-meta';

declare module 'next' {
  interface NextApiRequest {
    params: Record<string, any>;

    [NEXT_REQUEST_META]?: RequestMeta;

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
