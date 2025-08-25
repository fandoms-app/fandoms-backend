import { Controller, Get, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from 'src/auth/decorators/user-decorator';
import type { JwtPayload } from 'src/auth/types/jwt-payload';

@Controller('usuario')
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.usuarioService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMe(@User() user: JwtPayload) {
        return this.usuarioService.findOne(user.sub);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usuarioService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateUsuarioDto) {
        return this.usuarioService.update(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usuarioService.remove(id);
    }
}
