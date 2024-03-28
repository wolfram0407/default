import {Controller, Get, Post, Body, Patch, Param, Delete, Req} from '@nestjs/common';

import {CreateUserDto, SignupResDto} from '../dto/';
import {UserService, AuthService} from '../services';
import {ApiCreatedResponse, ApiExtraModels, ApiOperation, ApiTags} from '@nestjs/swagger';

@ApiTags('user')
@ApiExtraModels(SignupResDto)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

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

  ) {
    const reqInfo = {
      req: req.ip,
      endpoint: `${req.method} ${req.originalUrl}`,
      ua: req.headers['user-agent'] || '',
    };
  }
}


