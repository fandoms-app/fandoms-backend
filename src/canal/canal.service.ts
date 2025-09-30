import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCanalDto } from './dto/create-canal.dto';
import { UpdateCanalDto } from './dto/update-canal.dto';
import { CanalResponseDto } from './dto/canal-response.dto';
import { UsuarioResponseDto } from '../usuario/dto/usuario-response.dto';
import { Canal, Prisma, Usuario } from '@prisma/client';
import { OkResponseDto } from 'src/common/dto/ok-response.dto';

@Injectable()
export class CanalService {
    constructor(private readonly prisma: PrismaService) {}

    private toResponse(canal: Canal & { _count?: { seguidores: number } }): CanalResponseDto {
        return {
            id: canal.id,
            nombreCanal: canal.nombreCanal,
            descripcion: canal.descripcion,
            fechaCreacion: canal.fechaCreacion,
            idCanalPadre: canal.idCanalPadre,
            followersCount: canal._count?.seguidores ?? 0
        };
    }

    private toUsuarioResponse(user: Usuario): UsuarioResponseDto {
        const { passwordHash, ...safe } = user;
        return safe;
    }

    async create(dto: CreateCanalDto): Promise<CanalResponseDto> {
        if (dto.idCanalPadre) {
            const padre = await this.prisma.canal.findUnique({
                where: { id: dto.idCanalPadre }
            });
            if (!padre) throw new NotFoundException('Canal padre no encontrado');

            if (padre.idCanalPadre) {
                throw new ConflictException('Solo se pueden crear subcanales en canales raíz');
            }
        }

        const canal = await this.prisma.canal.create({
            data: {
                nombreCanal: dto.nombreCanal,
                descripcion: dto.descripcion,
                idCanalPadre: dto.idCanalPadre ?? null
            },
            include: { _count: { select: { seguidores: true } } }
        });

        return this.toResponse(canal);
    }

    async findAll(): Promise<CanalResponseDto[]> {
        const canales = await this.prisma.canal.findMany({
            include: { _count: { select: { seguidores: true } } }
        });
        return canales.map((c) => this.toResponse(c));
    }

    async findOne(id: string): Promise<CanalResponseDto> {
        const canal = await this.prisma.canal.findUnique({
            where: { id },
            include: { _count: { select: { seguidores: true } } }
        });
        if (!canal) throw new NotFoundException('Canal no encontrado');
        return this.toResponse(canal);
    }

    async update(id: string, dto: UpdateCanalDto): Promise<CanalResponseDto> {
        await this.findOne(id);

        const canal = await this.prisma.canal.update({
            where: { id },
            data: dto,
            include: { _count: { select: { seguidores: true } } }
        });

        return this.toResponse(canal);
    }

    async remove(id: string): Promise<CanalResponseDto> {
        await this.findOne(id);
        const canal = await this.prisma.canal.delete({
            where: { id },
            include: { _count: { select: { seguidores: true } } }
        });
        return this.toResponse(canal);
    }

    async follow(userId: string, canalId: string): Promise<OkResponseDto> {
        const canal = await this.prisma.canal.findUnique({ where: { id: canalId } });
        if (!canal) throw new NotFoundException('Canal no encontrado');

        try {
            await this.prisma.seguimientoCanal.create({
                data: { idUsuario: userId, idCanal: canalId }
            });
            return { ok: true };
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
                throw new ConflictException('Ya seguís este canal');
            }
            throw new InternalServerErrorException('Error al seguir el canal');
        }
    }

    async unfollow(userId: string, canalId: string): Promise<OkResponseDto> {
        const canal = await this.prisma.canal.findUnique({ where: { id: canalId } });
        if (!canal) throw new NotFoundException('Canal no encontrado');

        const result = await this.prisma.seguimientoCanal.deleteMany({
            where: { idUsuario: userId, idCanal: canalId }
        });

        if (result.count === 0) {
            throw new NotFoundException('No estabas siguiendo este canal');
        }

        return { ok: true };
    }

    async getFollowers(canalId: string): Promise<UsuarioResponseDto[]> {
        const seguidores = await this.prisma.seguimientoCanal.findMany({
            where: { idCanal: canalId },
            include: { usuario: true }
        });

        return seguidores.map((s) => this.toUsuarioResponse(s.usuario));
    }

    async getFollowedChannels(userId: string): Promise<CanalResponseDto[]> {
        const seguidos = await this.prisma.seguimientoCanal.findMany({
            where: { idUsuario: userId },
            include: {
                canal: { include: { _count: { select: { seguidores: true } } } }
            }
        });

        return seguidos.map((s) => this.toResponse(s.canal));
    }

    async getSubCanales(id: string): Promise<CanalResponseDto[]> {
        const subcanales = await this.prisma.canal.findMany({
            where: { idCanalPadre: id },
            include: { _count: { select: { seguidores: true } } }
        });
        return subcanales.map((c) => this.toResponse(c));
    }

    async findRoot(): Promise<CanalResponseDto[]> {
        const canales = await this.prisma.canal.findMany({
            where: { idCanalPadre: null },
            include: { _count: { select: { seguidores: true } } }
        });
        return canales.map((c) => this.toResponse(c));
    }
}
