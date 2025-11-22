import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/auth/guards/firebase-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { Roles } from 'src/auth/decorators/rol-decorator';
import { User } from 'src/auth/decorators/user-decorator';
import type { AuthUser } from 'src/auth/types/auth-user';
import { SolicitudCanalService } from './solicitudCanal.service';
import { SolicitudCanalDto } from './dto/solicitud-canal.dto';

@Controller('solicitudes-canal')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class SolicitudCanalController {
    constructor(private readonly service: SolicitudCanalService) {}

    @Post()
    create(@User() user: AuthUser, @Body() dto: SolicitudCanalDto) {
        return this.service.create(user.sub, dto);
    }

    @Get()
    @Roles('moderador', 'admin')
    findAll() {
        return this.service.findAll();
    }

    @Patch(':id/aprobar')
    @Roles('moderador', 'admin')
    aprobar(@Param('id') id: string) {
        return this.service.aprobar(id);
    }

    @Patch(':id/rechazar')
    @Roles('moderador', 'admin')
    rechazar(@Param('id') id: string) {
        return this.service.rechazar(id);
    }
}
