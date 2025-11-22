import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Prisma } from '@prisma/client';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { PublicacionResponseDto } from './dto/publicacion-response.dto';

type PublicacionBase = Prisma.PublicacionGetPayload<{
    include: { usuario: { select: { nombreUsuario: true; avatar: true } } };
}>;

type PublicacionConComentariosYUsuario = Prisma.PublicacionGetPayload<{
    include: {
        usuario: { select: { nombreUsuario: true; avatar: true } };
        comentarios: {
            include: { usuario: { select: { nombreUsuario: true; avatar: true } } };
            orderBy: { fechaCreacion: 'asc' };
        };
    };
}>;

@Injectable()
export class PublicacionService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cloudinaryService: CloudinaryService
    ) {}

    private toResponse(
        pub: (PublicacionConComentariosYUsuario | PublicacionBase) & {
            _count?: { comentarios: number } | null;
        }
    ): PublicacionResponseDto {
        const tieneComentarios = 'comentarios' in pub && Array.isArray(pub.comentarios);

        const comentarios = tieneComentarios ? pub.comentarios.map((c) => this.toResponse(c)) : [];

        const comentariosCount =
            pub._count && typeof pub._count.comentarios === 'number' ? pub._count.comentarios : comentarios.length;

        return {
            id: pub.id,
            titulo: pub.titulo,
            contenido: pub.contenido,
            mediaUrl: pub.mediaUrl,
            fechaCreacion: pub.fechaCreacion,
            idUsuario: pub.idUsuario,
            idCanal: pub.idCanal,
            idPublicacionPadre: pub.idPublicacionPadre,
            nombreUsuario: pub.usuario?.nombreUsuario,
            avatarUsuario: pub.usuario?.avatar ?? null,
            comentarios,
            comentariosCount,
            eliminada: pub.eliminada
        };
    }

    async create(
        idUsuario: string,
        dto: CreatePublicacionDto,
        file?: Express.Multer.File
    ): Promise<PublicacionResponseDto> {
        let mediaUrl: string | null = null;

        if (file) {
            const result = await this.cloudinaryService.uploadImage(file, 'publicaciones');
            mediaUrl = result.secure_url;
        }

        const data: Prisma.PublicacionCreateInput = {
            titulo: dto.titulo ?? null,
            contenido: dto.contenido,
            mediaUrl,
            usuario: { connect: { id: idUsuario } },
            canal: { connect: { id: dto.idCanal } },
            publicacionPadre: dto.idPublicacionPadre ? { connect: { id: dto.idPublicacionPadre } } : undefined
        };

        const pub = await this.prisma.publicacion.create({
            data,
            include: {
                usuario: { select: { nombreUsuario: true, avatar: true } },
                comentarios: {
                    include: { usuario: { select: { nombreUsuario: true, avatar: true } } }
                }
            }
        });

        return this.toResponse(pub);
    }

    async findByCanal(idCanal: string): Promise<PublicacionResponseDto[]> {
        const pubs = await this.prisma.publicacion.findMany({
            where: {
                idCanal,
                idPublicacionPadre: null
            },
            orderBy: { fechaCreacion: 'desc' },
            include: {
                usuario: { select: { nombreUsuario: true, avatar: true } },
                _count: { select: { comentarios: true } }
            }
        });

        return pubs.map((p) => this.toResponse({ ...p, comentarios: [] }));
    }

    async findOne(id: string): Promise<PublicacionResponseDto> {
        const pub = await this.prisma.publicacion.findUnique({
            where: { id },
            include: {
                usuario: { select: { nombreUsuario: true, avatar: true } },
                _count: { select: { comentarios: true } },
                comentarios: {
                    include: {
                        usuario: { select: { nombreUsuario: true, avatar: true } },
                        _count: { select: { comentarios: true } }
                    },
                    orderBy: { fechaCreacion: 'asc' }
                }
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
            },
            include: {
                usuario: { select: { nombreUsuario: true, avatar: true } },
                comentarios: {
                    include: { usuario: { select: { nombreUsuario: true, avatar: true } } }
                },
                _count: { select: { comentarios: true } }
            }
        });

        return this.toResponse(updated);
    }

    async remove(idUsuario: string, id: string): Promise<void> {
        const pub = await this.prisma.publicacion.findUnique({ where: { id } });
        if (!pub) throw new NotFoundException('Publicación no encontrada');

        const usuario = await this.prisma.usuario.findUnique({
            where: { id: idUsuario },
            select: { rol: true }
        });
        const esStaff = usuario?.rol === 'admin' || usuario?.rol === 'moderador';

        if (!esStaff && pub.idUsuario !== idUsuario) {
            throw new ForbiddenException('No puedes eliminar esta publicación');
        }

        await this.prisma.publicacion.update({
            where: { id },
            data: {
                eliminada: true,
                contenido: null,
                titulo: null,
                mediaUrl: null
            }
        });
    }
}
