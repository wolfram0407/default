import {Controller, Get, Post, Body, Patch, Param, Delete, Req, Headers, UseGuards} from '@nestjs/common';

import {AccessResDto, CreateUserDto, LoginResDto, SignupResDto} from '../dto/';
import {UserService, AuthService} from '../services';
import {ApiCreatedResponse, ApiExtraModels, ApiOperation, ApiTags, ApiBearerAuth} from '@nestjs/swagger';
import {LoginReqDto} from '../dto/login-req.dto';
import {JwtAuthGuard} from '../guards/jwt-auth.guard';
import {User, UserAfterAuth} from 'src/common/decorator/user.decorator';

@ApiTags('user')
@ApiExtraModels(SignupResDto)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {

  }

  @ApiOperation({summary: '회원가입', description: `이용자를 추가합니다.`})
  @ApiCreatedResponse({description: '유저를 생성한다', type: CreateUserDto})
  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto): Promise<SignupResDto> {
    const user = await this.userService.createUser(createUserDto)
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    }
  }

  @Post('login')
  async login(
    @Req() req,
    @Body() loginReqDto: LoginReqDto,
  ): Promise<LoginResDto> {
    const reqInfo = {
      ip: req.ip,
      endpoint: `${req.method} ${req.originalUrl}`,
      ua: req.headers['user-agent'] || '',
    };

    return this.authService.login(
      loginReqDto.email,
      loginReqDto.password,
      reqInfo
    )
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('refresh')
  async refresh(
    @Headers('authorization') authorization,
    @User() user: UserAfterAuth
  ): Promise<AccessResDto> {
    const token = /Bearer\s(.+)/.exec(authorization)[1];
    const accessToken = await this.authService.refreshAccessToken(token, user.id);
    return {
      accessToken
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  async logout(
    @User() user: UserAfterAuth
  ) {
    const status = this.authService.logout(user.id)

    return status ? {status: 'success'} : {status: 'fail'}
  }
}


