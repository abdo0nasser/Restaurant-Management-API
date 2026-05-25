import {
  HttpException,
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const { method, originalUrl } = request;
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = ctx.getResponse<Response>();
          const duration = Date.now() - start;
          this.logger.log(`${method} ${originalUrl} ${response.statusCode} ${duration}ms`);
        },
        error: (err: Error) => {
          const duration = Date.now() - start;
          const status = err instanceof HttpException ? err.getStatus() : 500;
          this.logger.error(`${method} ${originalUrl} ${status} ${duration}ms`);
        },
      }),
    );
  }
}
