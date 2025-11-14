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
import { User } from '../auth/decorators/user-decorator';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseAuthGuard } from 'src/auth/guards/firebase-auth.guard';
import type { AuthUser } from 'src/auth/types/auth-user';

@Controller('publicaciones')
@UseGuards(FirebaseAuthGuard)
export class PublicacionController {
    constructor(private readonly publicacionService: PublicacionService) {}

    // Crear publicacion
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    create(@User() user: AuthUser, @UploadedFile() file: Express.Multer.File, @Body() dto: CreatePublicacionDto) {
        return this.publicacionService.create(user.sub, dto, file);
    }

    // Responder a una publicacion
    @Post(':id/responder')
    @UseInterceptors(FileInterceptor('file'))
    reply(
        @User() user: AuthUser,
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
    @Patch(':id')
    update(@User() user: AuthUser, @Param('id') id: string, @Body() dto: UpdatePublicacionDto) {
        return this.publicacionService.update(user.sub, id, dto);
    }

    // Eliminar una publicacion propia
    @Delete(':id')
    remove(@User() user: AuthUser, @Param('id') id: string) {
        return this.publicacionService.remove(user.sub, id);
    }
}
