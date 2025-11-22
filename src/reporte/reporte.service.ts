import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReporteDto } from './dto/create-reporte.dto';
import { TipoReporte, EstadoReporte } from '@prisma/client';

@Injectable()
export class ReporteService {
    constructor(private readonly prisma: PrismaService) {}

    async create(idUsuarioReporta: string, dto: CreateReporteDto) {
        if (dto.tipo === TipoReporte.usuario) {
            const user = await this.prisma.usuario.findUnique({
                where: { id: dto.idObjetivo }
            });
            if (!user) throw new NotFoundException('El usuario reportado no existe');
        }

        if (dto.tipo === TipoReporte.publicacion) {
            const pub = await this.prisma.publicacion.findUnique({
                where: { id: dto.idObjetivo }
            });
            if (!pub) throw new NotFoundException('La publicación reportada no existe');
        }

        return this.prisma.reporte.create({
            data: {
                tipo: dto.tipo,
                motivo: dto.motivo,
                idObjetivo: dto.idObjetivo,
                idUsuarioReporta
            }
        });
    }

    async findAll() {
        return this.prisma.reporte.findMany({
            include: { usuarioReporta: { select: { id: true, nombreUsuario: true } } },
            orderBy: { fechaCreacion: 'desc' }
        });
    }

    async findOne(id: string) {
        const reporte = await this.prisma.reporte.findUnique({
            where: { id },
            include: { usuarioReporta: true }
        });
        if (!reporte) throw new NotFoundException('Reporte no encontrado');
        return reporte;
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.reporte.delete({ where: { id } });
    }

    async findPendientesPorTipo(tipo: TipoReporte) {
        return this.prisma.reporte.findMany({
            where: { tipo },
            orderBy: { fechaCreacion: 'desc' }
        });
    }

    async resolver(id: string) {
        await this.findOne(id);

        return this.prisma.reporte.update({
            where: { id },
            data: { estado: EstadoReporte.resuelto }
        });
    }

    async rechazar(id: string) {
        await this.findOne(id);

        return this.prisma.reporte.update({
            where: { id },
            data: { estado: EstadoReporte.rechazado }
        });
    }
}
