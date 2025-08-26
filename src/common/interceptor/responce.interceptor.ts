// Imports
import {
  Injectable,
  CallHandler,
  NestInterceptor,
  ExecutionContext,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        let message: string;
        let payload: any;

        if (typeof data === 'string') {
          // returned a message
          message = data;
          payload = null;
        } else if (data && typeof data === 'object' && 'message' in data) {
          // returned { message, ...rest }
          message = data.message;
          const { message: _, ...rest } = data;
          payload = Object.keys(rest).length > 0 ? rest : null;
        } else {
          // other object/array
          message = 'Success';
          payload = data;
        }

        return {
          success: true,
          statusCode: response.statusCode,
          message,
          data: payload,
          timestamp: new Date().toISOString(),
          path: ctx.getRequest().url,
        };
      }),
    );
  }
}
