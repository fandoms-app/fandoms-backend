import { RolGlobal } from 'generated/prisma';

export interface JwtPayload {
    sub: string; // id del usuario
    email: string;
    rol: RolGlobal;
}
