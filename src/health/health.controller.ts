import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { EchoDto } from './dto';

import { ApiCombineDecorators } from '../shared';

@ApiTags('Health')
@Controller()
export class HealthController {
  @ApiCombineDecorators({
    apiSummary: 'Get application name and version',
    apiDescription:
      'The purpose of this api is just to check if the system is up or down',
    successStatus: HttpStatus.OK,
    successDescription: 'Return application name and version',
  })
  @Get('version')
  public async getVersion() {
    return { name: 'boilerplate', version: '0.0.1' };
  }

  @ApiCombineDecorators({
    apiSummary: 'Get echo',
    apiDescription:
      'The purpose of this api is just to check if the system us up or down',
    successStatus: HttpStatus.CREATED,
    successDescription: 'Return same string',
  })
  @Post('echo')
  public async echo(@Body() body: EchoDto) {
    return body;
  }
}
