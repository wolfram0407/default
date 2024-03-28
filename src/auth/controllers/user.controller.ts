import {Controller, Get, Post, Body, Patch, Param, Delete, Req, Headers, UseGuards} from '@nestjs/common';

import {UserService, AuthService} from '../services';
import {ApiCreatedResponse, ApiExtraModels, ApiOperation, ApiTags, ApiBearerAuth} from '@nestjs/swagger';

@ApiTags('user')

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {

  }

  @Get('info')
  async getUserInfo() {

  }
}


