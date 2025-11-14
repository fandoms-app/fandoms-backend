import { Module } from '@nestjs/common';
import { PublicacionService } from './publicacion.service';
import { PublicacionController } from './publicacion.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [PrismaModule, CloudinaryModule, AuthModule],
    controllers: [PublicacionController],
    providers: [PublicacionService]
})
export class PublicacionModule {}
