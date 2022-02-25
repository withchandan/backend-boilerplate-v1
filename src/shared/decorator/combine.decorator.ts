/* eslint-disable @typescript-eslint/ban-types */
import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import {
  ApiSecurity,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export interface CombineDecoratorOptions {
  apiSummary: string;
  apiDescription?: string;
  successDescription: string;
  successStatus: HttpStatus;
  hasUnauthorized?: boolean;
  hasForbidden?: boolean;
  hasBadRequest?: boolean;
  hasNotFound?: boolean;
  successType?: Type<unknown> | Function | [Function] | string;
}

export const ApiCombineDecorators = (
  options: CombineDecoratorOptions,
): MethodDecorator => {
  const {
    apiSummary,
    apiDescription,
    successStatus,
    successDescription,
    successType,
  } = options;

  const array = [
    ApiOperation({ summary: apiSummary, description: apiDescription }),
    ApiResponse({
      status: successStatus,
      description: successDescription,
      type: successType,
    }),
    ApiInternalServerErrorResponse({ description: 'Internal server error' }),
  ];

  if (options.hasUnauthorized) {
    array.push(
      ApiBearerAuth(),
      ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    );
  }

  if (options.hasForbidden) {
    array.push(
      ApiSecurity('x-api-key'),
      ApiForbiddenResponse({ description: 'Forbidden' }),
    );
  }

  if (options.hasBadRequest) {
    array.push(ApiBadRequestResponse({ description: 'Bad request' }));
  }

  if (options.hasNotFound) {
    array.push(ApiNotFoundResponse({ description: 'Not Found' }));
  }

  return applyDecorators(...array);
};
