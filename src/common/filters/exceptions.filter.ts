// Imports
import {
  Catch,
  HttpStatus,
  ArgumentsHost,
  HttpException,
  ExceptionFilter,
} from '@nestjs/common';
import { formateReadableDate } from '../../common/date.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = (res as any).message || exception.message;
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      timestamp: formateReadableDate(new Date()),
    });
  }
}
