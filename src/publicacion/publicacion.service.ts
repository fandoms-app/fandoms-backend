import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { PublicacionResponseDto } from './dto/publicacion-response.dto';
import { Prisma, Publicacion } from '@prisma/client';

@Injectable()
export class PublicacionService {
    constructor(private readonly prisma: PrismaService) {}

    private toResponse(pub: Publicacion): PublicacionResponseDto {
        return {
            id: pub.id,
            titulo: pub.titulo,
            contenido: pub.contenido,
            fechaCreacion: pub.fechaCreacion,
            idUsuario: pub.idUsuario,
            idCanal: pub.idCanal,
            idPublicacionPadre: pub.idPublicacionPadre
        };
    }

    async create(idUsuario: string, dto: CreatePublicacionDto): Promise<PublicacionResponseDto> {
        const data: Prisma.PublicacionCreateInput = {
            titulo: dto.titulo ?? null,
            contenido: dto.contenido,
            usuario: { connect: { id: idUsuario } },
            canal: { connect: { id: dto.idCanal } },
            publicacionPadre: dto.idPublicacionPadre ? { connect: { id: dto.idPublicacionPadre } } : undefined
        };

        const pub = await this.prisma.publicacion.create({ data });
        return this.toResponse(pub);
    }

    async findByCanal(idCanal: string): Promise<PublicacionResponseDto[]> {
        const pubs = await this.prisma.publicacion.findMany({
            where: { idCanal, idPublicacionPadre: null },
            orderBy: { fechaCreacion: 'desc' }
        });
        return pubs.map((p) => this.toResponse(p));
    }

    async findOne(id: string): Promise<PublicacionResponseDto> {
        const pub = await this.prisma.publicacion.findUnique({
            where: { id },
            include: {
                comentarios: true
            }
        });
        if (!pub) throw new NotFoundException('Publicación no encontrada');
        return this.toResponse(pub);
    }

    async update(idUsuario: string, id: string, dto: UpdatePublicacionDto): Promise<PublicacionResponseDto> {
        const pub = await this.prisma.publicacion.findUnique({ where: { id } });
        if (!pub) throw new NotFoundException('Publicación no encontrada');
        if (pub.idUsuario !== idUsuario) throw new ForbiddenException('No puedes editar esta publicación');

        const updated = await this.prisma.publicacion.update({
            where: { id },
            data: {
                titulo: dto.titulo ?? pub.titulo,
                contenido: dto.contenido ?? pub.contenido
            }
        });

        return this.toResponse(updated);
    }

    async remove(idUsuario: string, id: string): Promise<void> {
        const pub = await this.prisma.publicacion.findUnique({ where: { id } });
        if (!pub) throw new NotFoundException('Publicación no encontrada');
        if (pub.idUsuario !== idUsuario) throw new ForbiddenException('No puedes eliminar esta publicación');

        await this.prisma.publicacion.delete({ where: { id } });
    }
}
