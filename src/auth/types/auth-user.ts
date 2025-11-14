import { RolGlobal } from '@prisma/client';

export interface AuthUser {
    sub: string;
    email?: string | null;
    nombreUsuario?: string | null;
    avatar?: string | null;
    rol?: RolGlobal;
}
