import {Module} from '@nestjs/common';
import {AuthService} from './services/auth.service';

import {UserService} from './services';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {TypeOrmModule} from '@nestjs/typeorm';
import {RefreshToken, User} from './entities';
import {RefreshTokenRepository, UserRepository} from './repositories';
import {JwtStrategy} from './strategies';
import {UserController, AuthController} from './controllers';




@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('ACCESS_TOKEN_EXPIRY'),
        },
      }),
    }),
    PassportModule.register({defaultStrategy: 'jwt'}),
    TypeOrmModule.forFeature([
      User,
      RefreshToken,

    ]),
  ],
  controllers: [AuthController, UserController],
  providers: [
    UserService,
    UserRepository,
    AuthService,
    RefreshTokenRepository,
    JwtStrategy,

  ],
})
export class AuthModule {}
