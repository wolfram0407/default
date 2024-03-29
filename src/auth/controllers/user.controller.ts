import {Controller, Get, Post, Body, Patch, Param, Delete, Req, Headers, UseGuards, Put} from '@nestjs/common';

import {UserService, AuthService} from '../services';
import {ApiCreatedResponse, ApiExtraModels, ApiOperation, ApiTags, ApiBearerAuth} from '@nestjs/swagger';
import {JwtAuthGuard} from '../guards/jwt-auth.guard';
import {User, UserAfterAuth} from 'src/common/decorator/user.decorator';
import {UpdateReqDto} from '../dto/update-user.dto';

@ApiTags('user')

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {

  }

  @ApiBearerAuth()
  @Get('info')
  async getUserInfo(
    @User() user: UserAfterAuth
  ): Promise<UserAfterAuth> {
    return user;
  }

  @ApiBearerAuth()
  @Put('info')
  async updateUserInfo(
    @User() user: UserAfterAuth,
    @Body() updateData: UpdateReqDto,
  ) {
    if (user.name === updateData.name && user.phone === updateData.phone) {
      return {
        message: 'success',
        user: {
          name: user.name,
          phone: user.phone
        }
      }
    }
    return await this.userService.updateUserInfo(user.id, updateData.name, updateData.phone)
  }

  @ApiBearerAuth()
  @Delete('info')
  async deleteUser(
    @User() {id}: UserAfterAuth
  ) {
    return await this.userService.deleteUser(id)
  }
}


