import { RolGlobal } from '@prisma/client';

export class UsuarioResponseDto {
    id!: string;
    nombreUsuario!: string;
    email!: string;
    avatar?: string | null;
    bio?: string | null;
    fechaNacimiento!: Date;
    fechaCreacion!: Date;
    rol!: RolGlobal;
}
