import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ReporteService } from './reporte.service';
import { CreateReporteDto } from './dto/create-reporte.dto';
import { User } from 'src/auth/decorators/user-decorator';
import { FirebaseAuthGuard } from 'src/auth/guards/firebase-auth.guard';
import type { AuthUser } from 'src/auth/types/auth-user';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { Roles } from 'src/auth/decorators/rol-decorator';

@Controller('reportes')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class ReporteController {
    constructor(private readonly reporteService: ReporteService) {}

    // Crear reporte
    @Post()
    create(@User() user: AuthUser, @Body() dto: CreateReporteDto) {
        return this.reporteService.create(user.sub, dto);
    }

    // Ver todos los reportes
    @Get()
    @Roles('moderador', 'admin')
    findAll() {
        return this.reporteService.findAll();
    }

    // Ver un reporte en detalle
    @Get(':id')
    @Roles('moderador', 'admin')
    findOne(@Param('id') id: string) {
        return this.reporteService.findOne(id);
    }

    // Eliminar un reporte
    @Delete(':id')
    @Roles('moderador', 'admin')
    remove(@Param('id') id: string) {
        return this.reporteService.remove(id);
    }
}
