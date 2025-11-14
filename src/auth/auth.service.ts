import { Injectable } from '@nestjs/common';
import { UsuarioService } from 'src/usuario/usuario.service';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { CreateUsuarioDto } from 'src/usuario/dto/create-usuario.dto';

@Injectable()
export class AuthService {
    constructor(private readonly usuarioService: UsuarioService) {}

    async findOrCreateFromFirebase(decodedToken: DecodedIdToken) {
        const email = decodedToken.email;
        if (!email) {
            throw new Error('El token de Firebase no contiene email');
        }

        const existing = await this.usuarioService.findByEmail(email);
        if (existing) return existing;

        const dto: CreateUsuarioDto = {
            email,
            nombreUsuario: typeof decodedToken.name === 'string' ? decodedToken.name : email.split('@')[0],
            password: 'firebase-auth-user',
            fechaNacimiento: new Date().toISOString(),
            avatar: typeof decodedToken.picture === 'string' ? decodedToken.picture : undefined,
            bio: undefined
        };

        const nuevoUsuario = await this.usuarioService.create(dto);
        return nuevoUsuario;
    }
}
