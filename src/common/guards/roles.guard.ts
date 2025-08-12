// Imports
import { Reflector } from '@nestjs/core';
import { raiseForbidden } from '../../config/error.config';
import { ROLES_KEY } from '../../common/decorators/roles.decorator';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw raiseForbidden('No user found in request.');
    }

    if (!requiredRoles.includes(user.role)) {
      throw raiseForbidden(
        'You do not have permission to access this resource.',
      );
    }

    return true;
  }
}
