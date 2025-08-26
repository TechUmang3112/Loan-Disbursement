// Imports
import { HttpException, HttpStatus } from '@nestjs/common';

export function raiseError(status: HttpStatus, message: string): never {
  throw new HttpException(
    {
      success: false,
      message,
    },
    status,
  );
}

export function raiseBadReq(message: string) {
  return raiseError(HttpStatus.BAD_REQUEST, message);
}

export function raiseUnauthorized(message: string) {
  return raiseError(HttpStatus.UNAUTHORIZED, message);
}

export function raiseForbidden(message: string) {
  return raiseError(HttpStatus.FORBIDDEN, message);
}

export function raiseNotFound(message: string) {
  return raiseError(HttpStatus.NOT_FOUND, message);
}

export function raiseTooManyReq(message: string) {
  return raiseError(HttpStatus.TOO_MANY_REQUESTS, message);
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
