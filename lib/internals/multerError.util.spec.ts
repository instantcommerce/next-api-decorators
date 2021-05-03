import { MulterError } from 'multer';
import { BadRequestException, HttpException, PayloadTooLargeException } from '../exceptions';
import { handleMulterError } from './multerError.util';

describe('handleMulterError', () => {
  it('Should return the error as is if it\'s not "MulterError"', () =>
    expect(handleMulterError(new Error('An error'))).not.toBeInstanceOf(HttpException));

  it('Should return PayloadTooLargeException', () =>
    expect(handleMulterError(new MulterError('LIMIT_FILE_SIZE', 'file'))).toBeInstanceOf(PayloadTooLargeException));

  it('Should return BadRequestException for other multer errors', () => {
    expect(handleMulterError(new MulterError('LIMIT_FIELD_COUNT', 'file'))).toBeInstanceOf(BadRequestException);
    expect(handleMulterError(new MulterError('LIMIT_FIELD_KEY', 'file'))).toBeInstanceOf(BadRequestException);
    expect(handleMulterError(new MulterError('LIMIT_FIELD_VALUE', 'file'))).toBeInstanceOf(BadRequestException);
    expect(handleMulterError(new MulterError('LIMIT_FILE_COUNT', 'file'))).toBeInstanceOf(BadRequestException);
    expect(handleMulterError(new MulterError('LIMIT_PART_COUNT', 'file'))).toBeInstanceOf(BadRequestException);
    expect(handleMulterError(new MulterError('LIMIT_UNEXPECTED_FILE', 'file'))).toBeInstanceOf(BadRequestException);
  });

  it('Should return the error as is if error message is not defined for multer.', () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(handleMulterError(new MulterError('NON_EXISTING_ERROR_CODE'))).toBeInstanceOf(MulterError));
});
