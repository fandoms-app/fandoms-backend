import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCanalDto } from './dto/create-canal.dto';
import { UpdateCanalDto } from './dto/update-canal.dto';

@Injectable()
export class CanalService {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateCanalDto) {
        if (dto.idCanalPadre) {
            const padre = await this.prisma.canal.findUnique({ where: { id: dto.idCanalPadre } });
            if (!padre) throw new NotFoundException('Canal padre no encontrado');
        }

        return this.prisma.canal.create({
            data: {
                nombreCanal: dto.nombreCanal,
                descripcion: dto.descripcion,
                idCanalPadre: dto.idCanalPadre ?? null
            }
        });
    }

    async findAll() {
        return this.prisma.canal.findMany({
            include: { subCanales: true }
        });
    }

    async findOne(id: string) {
        const canal = await this.prisma.canal.findUnique({
            where: { id },
            include: { subCanales: true, publicaciones: true }
        });
        if (!canal) throw new NotFoundException('Canal no encontrado');
        return canal;
    }

    async update(id: string, dto: UpdateCanalDto) {
        await this.findOne(id);
        return this.prisma.canal.update({
            where: { id },
            data: dto
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.canal.delete({ where: { id } });
    }

    async follow(userId: string, canalId: string) {
        try {
            return await this.prisma.seguimientoCanal.create({
                data: { idUsuario: userId, idCanal: canalId }
            });
        } catch {
            throw new ConflictException('Ya seguís este canal');
        }
    }

    async unfollow(userId: string, canalId: string) {
        const result = await this.prisma.seguimientoCanal.deleteMany({
            where: { idUsuario: userId, idCanal: canalId }
        });

        if (result.count === 0) {
            throw new NotFoundException('No seguías este canal');
        }

        return { ok: true };
    }

    async getFollowers(canalId: string) {
        const seguidores = await this.prisma.seguimientoCanal.findMany({
            where: { idCanal: canalId },
            include: { usuario: true }
        });
        return seguidores.map((s) => s.usuario);
    }

    async getFollowedByUser(userId: string) {
        const seguidos = await this.prisma.seguimientoCanal.findMany({
            where: { idUsuario: userId },
            include: { canal: true }
        });
        return seguidos.map((s) => s.canal);
    }

    async getSubCanales(id: string) {
        return this.prisma.canal.findMany({ where: { idCanalPadre: id } });
    }
}
