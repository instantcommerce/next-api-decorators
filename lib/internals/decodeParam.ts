/**
 * Decode param value.
 *
 * @param val
 *
 * @remarks
 * Taken from express.js (https://github.com/expressjs/express/blob/508936853a6e311099c9985d4c11a4b1b8f6af07/lib/router/layer.js#L166)
 */
export function decodeParam(val: string): string {
  if (typeof val !== 'string' || val.length === 0) {
    return val;
  }

  try {
    return decodeURIComponent(val);
  } catch (err) {
    if (err instanceof URIError) {
      err.message = "Failed to decode param '" + val + "'";
    }

    throw err;
  }
}
