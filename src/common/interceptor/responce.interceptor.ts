// Imports
import {
  Injectable,
  CallHandler,
  NestInterceptor,
  ExecutionContext,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { formateReadableDate } from '../../common/date.service';

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
          // returned { message, ...other data}
          message = data.message;
          const { message: _, ...rest } = data;
          payload = Object.keys(rest).length > 0 ? rest : null;
        } else {
          // other object/array
          message = 'Success';
          payload = data;
        }

        payload = this.transformDates(payload);

        return {
          success: true,
          statusCode: response.statusCode,
          message,
          data: payload,
          timestamp: formateReadableDate(new Date()),
        };
      }),
    );
  }

  private transformDates(data: any): any {
    if (!data) return data;
    if (typeof data.toJSON === 'function') {
      data = data.toJSON();
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.transformDates(item));
    } else if (data && typeof data === 'object') {
      const transformed: any = {};
      for (const key of Object.keys(data)) {
        if ((key === 'createdAt' || key === 'updatedAt') && data[key]) {
          transformed[key] = formateReadableDate(data[key]);
        } else {
          transformed[key] = this.transformDates(data[key]);
        }
      }
      return transformed;
    }
    return data;
  }
}
