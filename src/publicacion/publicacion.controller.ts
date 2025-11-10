import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { PublicacionService } from './publicacion.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user-decorator';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('publicaciones')
export class PublicacionController {
    constructor(private readonly publicacionService: PublicacionService) {}

    // Crear publicacion
    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    create(@User() user: JwtPayload, @UploadedFile() file: Express.Multer.File, @Body() dto: CreatePublicacionDto) {
        return this.publicacionService.create(user.sub, dto, file);
    }

    // Responder a una publicacion
    @UseGuards(JwtAuthGuard)
    @Post(':id/responder')
    @UseInterceptors(FileInterceptor('file'))
    reply(
        @User() user: JwtPayload,
        @Param('id') idPadre: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: CreatePublicacionDto
    ) {
        return this.publicacionService.create(user.sub, { ...dto, idPublicacionPadre: idPadre }, file);
    }

    // Obtener todas las publicaciones de un canal
    @Get('canal/:idCanal')
    findByCanal(@Param('idCanal') idCanal: string) {
        return this.publicacionService.findByCanal(idCanal);
    }

    // Obtener una publicacion con comentarios
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

    // Eliminar una publicacion propia
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@User() user: JwtPayload, @Param('id') id: string) {
        return this.publicacionService.remove(user.sub, id);
    }
}
