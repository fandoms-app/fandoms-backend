import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { admin } from 'src/firebase/firebase-admin.config';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { AuthUser } from 'src/auth/types/auth-user';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request>();
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            throw new UnauthorizedException('Token de Firebase no provisto');
        }

        const token = authHeader.split(' ')[1];

        try {
            const decodedToken: DecodedIdToken = await admin.auth().verifyIdToken(token);

            const usuarioDB = await this.authService.findOrCreateFromFirebase(decodedToken);

            const authUser: AuthUser = {
                sub: usuarioDB.id,
                email: usuarioDB.email,
                nombreUsuario: usuarioDB.nombreUsuario,
                avatar: usuarioDB.avatar ?? null
            };

            req.user = authUser;
            return true;
        } catch (err) {
            console.error('Error al verificar el token Firebase:', err);
            throw new UnauthorizedException('Token de Firebase inválido o expirado');
        }
    }
}
