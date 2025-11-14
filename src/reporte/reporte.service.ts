import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReporteDto } from './dto/create-reporte.dto';
import { TipoReporte } from '@prisma/client';

@Injectable()
export class ReporteService {
    constructor(private readonly prisma: PrismaService) {}

    async create(idUsuarioReporta: string, dto: CreateReporteDto) {
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
}
