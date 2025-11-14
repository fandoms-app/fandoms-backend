import { Module, forwardRef } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [CloudinaryModule, forwardRef(() => AuthModule)],
    controllers: [UsuarioController],
    providers: [UsuarioService],
    exports: [UsuarioService]
})
export class UsuarioModule {}
