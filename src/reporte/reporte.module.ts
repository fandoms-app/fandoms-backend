import { Module } from '@nestjs/common';
import { ReporteService } from './reporte.service';
import { ReporteController } from './reporte.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [ReporteController],
    providers: [ReporteService]
})
export class ReporteModule {}
