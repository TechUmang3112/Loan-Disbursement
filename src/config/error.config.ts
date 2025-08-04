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

export function raiseOk(err_msg: string) {
  throw new HttpException({ success: true, message: err_msg }, HttpStatus.OK);
}
