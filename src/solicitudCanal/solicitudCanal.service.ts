import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EstadoSolicitud } from '@prisma/client';
import { CanalService } from '../canal/canal.service';
import { SolicitudCanalDto } from './dto/solicitud-canal.dto';

@Injectable()
export class SolicitudCanalService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly canalService: CanalService
    ) {}

    async create(idUsuario: string, dto: SolicitudCanalDto) {
        return this.prisma.solicitudCanal.create({
            data: {
                idUsuario,
                nombre: dto.nombre,
                descripcion: dto.descripcion,
                idCanalPadre: dto.idCanalPadre ?? null
            }
        });
    }

    async findAll() {
        return this.prisma.solicitudCanal.findMany({
            orderBy: { fechaSolicitud: 'desc' },
            include: {
                usuario: { select: { id: true, nombreUsuario: true } }
            }
        });
    }

    async aprobar(id: string) {
        const solicitud = await this.prisma.solicitudCanal.findUnique({
            where: { id }
        });

        if (!solicitud) throw new NotFoundException('Solicitud no encontrada');

        // Crear canal real
        const canal = await this.canalService.createFromRequest(
            solicitud.nombre,
            solicitud.descripcion ?? null,
            solicitud.idCanalPadre
        );

        // Cambiar estado de solicitud
        await this.prisma.solicitudCanal.update({
            where: { id },
            data: { estado: EstadoSolicitud.aprobada }
        });

        return canal;
    }

    async rechazar(id: string) {
        await this.prisma.solicitudCanal.update({
            where: { id },
            data: { estado: EstadoSolicitud.rechazada }
        });

        return { ok: true };
    }
}
