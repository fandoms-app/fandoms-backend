import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PublicacionService } from './publicacion.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user-decorator';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';

@Controller('publicaciones')
export class PublicacionController {
    constructor(private readonly publicacionService: PublicacionService) {}

    // Crear publicación o comentario
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@User() user: JwtPayload, @Body() dto: CreatePublicacionDto) {
        return this.publicacionService.create(user.sub, dto);
    }

    // Obtener todas las publicaciones de un canal
    @Get('canal/:idCanal')
    findByCanal(@Param('idCanal') idCanal: string) {
        return this.publicacionService.findByCanal(idCanal);
    }

    // Obtener una publicación (con comentarios)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.publicacionService.findOne(id);
    }

    // Actualizar una publicación propia
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@User() user: JwtPayload, @Param('id') id: string, @Body() dto: UpdatePublicacionDto) {
        return this.publicacionService.update(user.sub, id, dto);
    }

    // Eliminar una publicación propia
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@User() user: JwtPayload, @Param('id') id: string) {
        return this.publicacionService.remove(user.sub, id);
    }
}
