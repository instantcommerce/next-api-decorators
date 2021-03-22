import 'next';

declare module 'next' {
  interface NextApiRequest {
    params: Record<string, any>;
  }
}
