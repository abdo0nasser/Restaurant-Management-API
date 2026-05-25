import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  DatabaseError,
  DuplicateEntityError,
  EntityNotFoundError,
  InvalidInputError,
} from '../errors/domain-errors';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, message } = this.mapError(exception);

    response.status(status).json({
      statusCode: status,
      message: Array.isArray(message) ? message : [message],
      error: this.getError(status),
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private mapError(exception: unknown): {
    status: number;
    message: string | string[];
  } {
    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      if (typeof res === 'string')
        return { status: exception.getStatus(), message: res };
      return {
        status: exception.getStatus(),
        message: (res as { message: string | string[] }).message ?? 'Error',
      };
    }

    if (exception instanceof EntityNotFoundError) {
      return { status: 404, message: exception.message };
    }
    if (exception instanceof DuplicateEntityError) {
      return { status: 409, message: exception.message };
    }
    if (exception instanceof InvalidInputError) {
      return { status: 400, message: exception.message };
    }
    if (exception instanceof DatabaseError) {
      return { status: 500, message: exception.message };
    }

    return { status: 500, message: 'Internal server error' };
  }

  private getError(status: number): string {
    const labels: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      409: 'Conflict',
      422: 'Unprocessable Entity',
      429: 'Too Many Requests',
      500: 'Internal Server Error',
    };
    return labels[status] ?? 'Unknown Error';
  }
}
