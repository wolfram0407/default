
import {JwtService} from '@nestjs/jwt';
import {ExecutionContext, Inject, Injectable, Logger, LoggerService, UnauthorizedException} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {AuthGuard} from "@nestjs/passport";
import {Observable} from "rxjs";
import {UserService} from '../services';


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private userService: UserService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context)
  }
}