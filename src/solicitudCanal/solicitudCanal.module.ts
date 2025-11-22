import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { CanalModule } from '../canal/canal.module';
import { SolicitudCanalController } from './solicitudCanal.controller';
import { SolicitudCanalService } from './solicitudCanal.service';

@Module({
    imports: [PrismaModule, CanalModule, AuthModule],
    controllers: [SolicitudCanalController],
    providers: [SolicitudCanalService],
    exports: [SolicitudCanalService]
})
export class SolicitudCanalModule {}
