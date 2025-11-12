import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles-decorator';
import { RolGlobal } from '@prisma/client';
import { JwtPayload } from '../types/jwt-payload';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<RolGlobal[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const http = context.switchToHttp();
        const request = http.getRequest<unknown>();

        const user = (request as { user?: JwtPayload }).user;

        if (!user) {
            throw new ForbiddenException('Usuario no autenticado');
        }

        if (!requiredRoles.includes(user.rol)) {
            throw new ForbiddenException('No tenés permiso para realizar esta acción');
        }

        return true;
    }
}
