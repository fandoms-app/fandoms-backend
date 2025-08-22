import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, UsuarioModule, AuthModule]
})
export class AppModule {}
