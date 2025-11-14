import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ReporteService } from './reporte.service';
import { CreateReporteDto } from './dto/create-reporte.dto';
import { User } from 'src/auth/decorators/user-decorator';
import { FirebaseAuthGuard } from 'src/auth/guards/firebase-auth.guard';
import type { AuthUser } from 'src/auth/types/auth-user';

@Controller('reportes')
@UseGuards(FirebaseAuthGuard)
export class ReporteController {
    constructor(private readonly reporteService: ReporteService) {}

    // Crear reporte
    @Post()
    create(@User() user: AuthUser, @Body() dto: CreateReporteDto) {
        return this.reporteService.create(user.sub, dto);
    }

    // Ver todos los reportes
    @Get()
    findAll() {
        return this.reporteService.findAll();
    }

    // Ver un reporte en detalle
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.reporteService.findOne(id);
    }

    // Eliminar un reporte
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.reporteService.remove(id);
    }
}
