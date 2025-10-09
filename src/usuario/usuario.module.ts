import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
    imports: [CloudinaryModule],
    controllers: [UsuarioController],
    providers: [UsuarioService],
    exports: [UsuarioService] // necesario para authservice
})
export class UsuarioModule {}
