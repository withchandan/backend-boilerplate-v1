import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  ValidationError,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

interface ExceptionResponseObject {
  type?: string;
  statusCode?: number;
  message?: string | Record<string, unknown>;
  error?: string;
  stack?: string;
}

interface FlattenError {
  value?: any;
  field?: string;
  message: string;
}

type FlattenErrors = FlattenError[];

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  flattenError(
    error: ValidationError[],
    field = '',
    err: FlattenErrors = [],
  ): FlattenErrors {
    const errorDetails: FlattenErrors = err;

    error.forEach((e) => {
      const property = field ? `${field}.${e.property}` : e.property;

      if (e.constraints) {
        errorDetails.push({
          field: property,
          ...(e.value && { value: e.value }),
          message: Object.values(e.constraints)[0],
        });
      }

      if (Array.isArray(e.children) && e.children.length) {
        this.flattenError(e.children, property, errorDetails);
      }
    });

    return errorDetails;
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let httpStatus;
    let message: string;
    let errors: FlattenError[];

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      const errRes = exceptionResponse as ExceptionResponseObject;

      if (typeof errRes.error === 'string') {
        message = errRes.error;
      }

      if (typeof errRes.message === 'string') {
        errors = [{ message: errRes.message }];
      }

      if (Array.isArray(errRes.message)) {
        errors = this.flattenError(errRes.message);
      }
    } else {
      console.log('unexpected error:', exception);

      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal Server Error';
    }

    const responseBody = { code: httpStatus, message, errors };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
