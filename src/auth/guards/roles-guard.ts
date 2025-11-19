import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolGlobal } from '@prisma/client';
import { ROLES_KEY } from '../decorators/rol-decorator';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<RolGlobal[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const req = context.switchToHttp().getRequest<Request>();
        const user = req.user;

        if (!user) {
            throw new ForbiddenException('No autenticado');
        }

        if (!requiredRoles.includes(user.rol as RolGlobal)) {
            throw new ForbiddenException('No tienes permisos para acceder');
        }

        return true;
    }
}
