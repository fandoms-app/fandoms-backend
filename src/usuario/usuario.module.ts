import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';

@Module({
    controllers: [UsuarioController],
    providers: [UsuarioService],
    exports: [UsuarioService] // necesario para authservice
})
export class UsuarioModule {}
