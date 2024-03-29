import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import postgresConfig from './config/postgres.config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuthModule} from './auth/auth.module';
import {APP_INTERCEPTOR} from '@nestjs/core';
import {LoggingReqInterceptor} from './common/interceptors';



@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
      load: [postgresConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
      }),

    }),
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingReqInterceptor,
    }
  ],
})
export class AppModule {}
