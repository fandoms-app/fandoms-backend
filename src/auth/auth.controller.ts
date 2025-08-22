import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUsuarioDto } from '../usuario/dto/create-usuario.dto';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // registro
    @Post('register')
    register(@Body() dto: CreateUsuarioDto) {
        return this.authService.register(dto);
    }

    // login con strategy local (email y password)
    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Request() req: { user: { id: string; email: string; rol: string } }) {
        const payload = { sub: req.user.id, email: req.user.email, rol: req.user.rol };
        return {
            accessToken: this.authService['signAccessToken'](payload),
            refreshToken: this.authService['signRefreshToken'](payload)
        };
    }

    // refresh (intercambia refreshtoken por tokens nuevos)
    @Post('refresh')
    refresh(@Body() dto: RefreshDto) {
        return this.authService.refresh(dto.refreshToken);
    }
}
