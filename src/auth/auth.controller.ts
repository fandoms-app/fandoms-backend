import { Controller, Get, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { User } from '../auth/decorators/user-decorator';
import { AuthService } from './auth.service';
import type { DecodedIdToken } from 'firebase-admin/auth';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(FirebaseAuthGuard)
    @Get('profile')
    async getProfile(@User() firebaseUser: DecodedIdToken) {
        const usuario = await this.authService.findOrCreateFromFirebase(firebaseUser);
        return {
            message: 'Autenticado con Firebase',
            usuario
        };
    }
}
