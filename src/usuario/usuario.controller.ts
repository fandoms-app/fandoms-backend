import {
    Controller,
    Get,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Post,
    Query,
    UseInterceptors,
    UploadedFile
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from 'src/auth/decorators/user-decorator';
import type { JwtPayload } from 'src/auth/types/jwt-payload';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles-decorator';
import { RolGlobal } from 'generated/prisma';

@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService) {}

    // devuelve todos los usuarios
    @Get()
    @Roles(RolGlobal.admin)
    findAll() {
        return this.usuarioService.findAll();
    }

    // devuelve el usuario logueado
    @Get('me')
    async getMe(@User() user: JwtPayload) {
        return this.usuarioService.findOne(user.sub);
    }

    // sube el avatar del usuario logueado
    @Patch('me/avatar')
    @UseInterceptors(FileInterceptor('file'))
    async uploadAvatar(@User() user: JwtPayload, @UploadedFile() file: Express.Multer.File) {
        return this.usuarioService.uploadAvatar(user.sub, file);
    }

    // actualiza el usuario logueado
    @Patch('me')
    updateMe(@User() user: JwtPayload, @Body() dto: UpdateUsuarioDto) {
        return this.usuarioService.update(user.sub, dto);
    }

    // busca usuarios y canales por nombre
    @Get('search')
    search(@Query('q') query: string) {
        return this.usuarioService.search(query);
    }

    // devuelve un usuario por id
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usuarioService.findOne(id);
    }

    // actualiza un usuario por id
    @Patch(':id')
    @Roles(RolGlobal.admin, RolGlobal.moderador)
    update(@Param('id') id: string, @Body() dto: UpdateUsuarioDto) {
        return this.usuarioService.update(id, dto);
    }

    // asignar rol a usuario (solo admin)
    @Patch(':id/rol')
    @Roles(RolGlobal.admin, RolGlobal.moderador)
    assignRole(@Param('id') id: string, @Body() body: { rol: RolGlobal }) {
        return this.usuarioService.assignRole(id, body.rol);
    }

    // sigue a un usuario por id
    @Post(':id/follow')
    follow(@User() user: JwtPayload, @Param('id') id: string) {
        return this.usuarioService.follow(user.sub, id);
    }

    // deja de seguir a un usuario por id
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
    @Delete(':id')
    @Roles(RolGlobal.admin, RolGlobal.moderador)
    remove(@Param('id') id: string) {
        return this.usuarioService.remove(id);
    }

    // perfil extendido (para ver publicaciones, seguidores, seguidos)
    @Get(':id/profile')
    getProfile(@Param('id') id: string) {
        return this.usuarioService.findProfile(id);
    }
}
