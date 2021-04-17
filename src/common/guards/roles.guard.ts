import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isNullOrEmpty } from '../function.helper';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // const hasRole = () =>
    //   roles.find(x => x === user.role);
    //user.role.some(role => !!roles.find(item => item === role));

    return user && user.role && !isNullOrEmpty(roles.find(x => x === user.role)); //hasRole();
  }
}