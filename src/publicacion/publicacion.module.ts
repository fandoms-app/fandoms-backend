import { Module } from '@nestjs/common';
import { PublicacionService } from './publicacion.service';
import { PublicacionController } from './publicacion.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [PublicacionController],
    providers: [PublicacionService, PrismaService]
})
export class PublicacionModule {}
