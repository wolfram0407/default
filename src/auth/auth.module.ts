import {Module} from '@nestjs/common';
import {AuthService} from './services/auth.service';
import {AuthController} from './controllers/auth.controller';
import {UserService} from './services';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {TypeOrmModule} from '@nestjs/typeorm';
import {RefreshToken, User} from './entities';
import {UserRepository} from './repositories';

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
  controllers: [AuthController],
  providers: [
    UserService,
    UserRepository,
    AuthService,

  ],
})
export class AuthModule {}
