import {CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor} from "@nestjs/common";
import {Observable, catchError} from "rxjs";
import {User} from "src/auth/entities";
import {Request} from "express";
import {tap} from 'rxjs/operators';

@Injectable()
export class LoggingReqInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingReqInterceptor.name);
  constructor() {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const {ip, method, originalUrl} = request;
    const userAgent = request.headers['user-agent'] || '';
    const user = request.user as User;
    // next$ -> observable / tap() -> Observable 조작
    // next -> error없는 경우 / error error발생시 실행  
    return next.handle().pipe(
      tap(() => {
        try {
          if (originalUrl !== '/auth/login') {
            // db에 저장한거나 조작하면 됨
            this.logger.log(`${method} ${originalUrl} - ${userAgent} ${ip} ${user}`)
          }
        } catch (err) {
          this.logger.error('Failed to create access log');
        }
      }),
      catchError((err) => {
        this.logger.error(`Error in request: ${err}`);
        throw err;
      })
    );
  }
}