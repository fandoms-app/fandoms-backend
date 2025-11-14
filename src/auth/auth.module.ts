import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';
import { AuthService } from './auth.service';
import { UsuarioModule } from '../usuario/usuario.module';

@Module({
    imports: [forwardRef(() => UsuarioModule)],
    controllers: [AuthController],
    providers: [AuthService, FirebaseAuthGuard],
    exports: [AuthService, FirebaseAuthGuard]
})
export class AuthModule {}
