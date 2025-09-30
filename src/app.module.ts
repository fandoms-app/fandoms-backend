import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { CanalModule } from './canal/canal.module';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, AuthModule, UsuarioModule, CanalModule]
})
export class AppModule {}
