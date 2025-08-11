// Imports
import { HttpException, HttpStatus } from '@nestjs/common';

export function raiseBadReq(err_msg: string) {
  throw new HttpException(
    { success: false, message: err_msg },
    HttpStatus.BAD_REQUEST,
  );
}

export function raiseNotFound(err_msg: string) {
  throw new HttpException(
    { success: false, message: err_msg },
    HttpStatus.NOT_FOUND,
  );
}

export function raiseTooManyReq(err_msg: string) {
  throw new HttpException(
    { success: false, message: err_msg },
    HttpStatus.TOO_MANY_REQUESTS,
  );
}

export function raiseUnauthorized(err_msg: string) {
  throw new HttpException(
    { success: false, message: err_msg },
    HttpStatus.UNAUTHORIZED,
  );
}

export function sendOk(msg: string, status: HttpStatus = HttpStatus.OK) {
  const responseObj: any = {};
  const prepareResponse: any = {};
  if (responseObj?.message) prepareResponse.message = responseObj.message;
  if (responseObj.statusCode)
    prepareResponse.statusCode = responseObj.statusCode;
  delete responseObj?.message;
  delete responseObj?.statusCode;
  if (Object.keys(responseObj).length > 0) prepareResponse.data = responseObj;
  prepareResponse.success = true;
  return { success: true, message: msg, statusCode: status };
}

export function raiseForbidden(err_msg: string) {
  throw new HttpException(
    { success: false, message: err_msg },
    HttpStatus.FORBIDDEN,
  );
}
