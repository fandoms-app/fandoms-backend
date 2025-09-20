import { Controller, Get, Body, Patch, Param, Delete, UseGuards, Post } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from 'src/auth/decorators/user-decorator';
import type { JwtPayload } from 'src/auth/types/jwt-payload';

@Controller('usuario')
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService) {}

    // devuelve todos los usuarios
    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.usuarioService.findAll();
    }

    // devuelve el usuario logueado
    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMe(@User() user: JwtPayload) {
        return this.usuarioService.findOne(user.sub);
    }

    // actualiza el usuario logueado
    @UseGuards(JwtAuthGuard)
    @Patch('me')
    updateMe(@User() user: JwtPayload, @Body() dto: UpdateUsuarioDto) {
        return this.usuarioService.update(user.sub, dto);
    }

    // devuelve un usuario por id
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usuarioService.findOne(id);
    }

    // actualiza un usuario por id
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateUsuarioDto) {
        return this.usuarioService.update(id, dto);
    }

    // sigue a un usuario por id
    @UseGuards(JwtAuthGuard)
    @Post(':id/follow')
    follow(@User() user: JwtPayload, @Param('id') id: string) {
        return this.usuarioService.follow(user.sub, id);
    }

    // deja de seguir a un usuario por id
    @UseGuards(JwtAuthGuard)
    @Delete(':id/follow')
    unfollow(@User() user: JwtPayload, @Param('id') id: string) {
        return this.usuarioService.unfollow(user.sub, id);
    }

    // obtiene los seguidores de un usuario por id
    @Get(':id/seguidores')
    getFollowers(@Param('id') id: string) {
        return this.usuarioService.getFollowers(id);
    }

    // obtiene los usuarios seguidos por un usuario por id
    @Get(':id/seguidos')
    getFollowing(@Param('id') id: string) {
        return this.usuarioService.getFollowing(id);
    }

    // elimina un usuario por id
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usuarioService.remove(id);
    }

    // perfil extendido (para ver publicaciones, seguidores, seguidos)
    @UseGuards(JwtAuthGuard)
    @Get(':id/profile')
    getProfile(@Param('id') id: string) {
        return this.usuarioService.findProfile(id);
    }
}
