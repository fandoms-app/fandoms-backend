import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../usuario/usuario.service';
import { CreateUsuarioDto } from '../usuario/dto/create-usuario.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './types/jwt-payload';

@Injectable()
export class AuthService {
    constructor(
        private readonly usuarioService: UsuarioService,
        private readonly jwtService: JwtService,
        private readonly config: ConfigService
    ) {}

    // registro
    async register(dto: CreateUsuarioDto) {
        const user = await this.usuarioService.create(dto);
        const payload = { sub: user.id, email: user.email, rol: user.rol };
        return {
            accessToken: this.signAccessToken(payload),
            refreshToken: this.signRefreshToken(payload)
        };
    }

    // usado por localstrategy
    async validateUser(email: string, password: string) {
        const user = await this.usuarioService.findByEmail(email);
        if (!user) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return {
            id: user.id,
            email: user.email,
            nombreUsuario: user.nombreUsuario,
            rol: user.rol
        };
    }

    private signAccessToken(payload: JwtPayload) {
        const expiresIn = this.config.get<string>('JWT_EXPIRES_IN') ?? '15m';
        const secret = this.config.get<string>('JWT_SECRET') ?? 'default-access-secret';
        return this.jwtService.sign(payload, { expiresIn, secret });
    }

    private signRefreshToken(payload: JwtPayload) {
        const expiresIn = this.config.get<string>('REFRESH_JWT_EXPIRES_IN') ?? '7d';
        const secret = this.config.get<string>('REFRESH_JWT_SECRET') ?? 'default-refresh-secret';
        return this.jwtService.sign(payload, { expiresIn, secret });
    }

    async login(dto: LoginDto) {
        const user = await this.usuarioService.findByEmail(dto.email);
        if (!user) throw new UnauthorizedException('Credenciales inválidas');

        const ok = await bcrypt.compare(dto.password, user.passwordHash);
        if (!ok) throw new UnauthorizedException('Credenciales inválidas');

        const payload = { sub: user.id, email: user.email, rol: user.rol };
        return {
            accessToken: this.signAccessToken(payload),
            refreshToken: this.signRefreshToken(payload)
        };
    }

    refresh(refreshToken: string) {
        const secret = this.config.get<string>('REFRESH_JWT_SECRET') ?? 'default-refresh-secret';
        try {
            const decoded = this.jwtService.verify<JwtPayload>(refreshToken, { secret });
            const payload: JwtPayload = { sub: decoded.sub, email: decoded.email, rol: decoded.rol };
            return {
                accessToken: this.signAccessToken(payload),
                refreshToken: this.signRefreshToken(payload)
            };
        } catch {
            throw new UnauthorizedException('Refresh token inválido o expirado');
        }
    }
}
