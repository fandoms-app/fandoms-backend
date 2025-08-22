import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma, Usuario } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';
import { UsuarioResponseDto } from './dto/usuario-response.dto';

@Injectable()
export class UsuarioService {
    constructor(private readonly prisma: PrismaService) {}

    private toResponse(user: Usuario): UsuarioResponseDto {
        const { passwordHash, ...safe } = user;
        return safe;
    }

    async create(dto: CreateUsuarioDto): Promise<UsuarioResponseDto> {
        const exists = await this.prisma.usuario.findFirst({
            where: {
                OR: [{ email: dto.email }, { nombreUsuario: dto.nombreUsuario }]
            }
        });
        if (exists) throw new ConflictException('Email o nombre de usuario ya registrados');

        const passwordHash = await bcrypt.hash(dto.password, 10);

        const user = await this.prisma.usuario.create({
            data: {
                nombreUsuario: dto.nombreUsuario,
                email: dto.email,
                passwordHash,
                avatar: dto.avatar,
                bio: dto.bio,
                fechaNacimiento: new Date(dto.fechaNacimiento)
            }
        });

        return this.toResponse(user);
    }

    async findAll(): Promise<UsuarioResponseDto[]> {
        const users = await this.prisma.usuario.findMany();
        return users.map((u) => this.toResponse(u));
    }

    async findOne(id: string): Promise<UsuarioResponseDto> {
        const user = await this.prisma.usuario.findUnique({ where: { id } });
        if (!user) throw new NotFoundException('Usuario no encontrado');
        return this.toResponse(user);
    }

    async findByEmail(email: string): Promise<Usuario | null> {
        // aca devuelve el modelo completo porque lo necesita authservice para comparar el passwordhash
        return this.prisma.usuario.findUnique({ where: { email } });
    }

    async update(id: string, dto: UpdateUsuarioDto): Promise<UsuarioResponseDto> {
        await this.findOne(id);

        let passwordHash: string | undefined;
        if (dto.password) {
            passwordHash = await bcrypt.hash(dto.password, 10);
        }

        const data: Prisma.UsuarioUpdateInput = {
            nombreUsuario: dto.nombreUsuario,
            email: dto.email,
            avatar: dto.avatar,
            bio: dto.bio,
            fechaNacimiento: dto.fechaNacimiento ? new Date(dto.fechaNacimiento) : undefined,
            ...(passwordHash ? { passwordHash } : {})
        };

        const user = await this.prisma.usuario.update({
            where: { id },
            data
        });

        return this.toResponse(user);
    }

    async remove(id: string): Promise<void> {
        await this.findOne(id);
        await this.prisma.usuario.delete({ where: { id } });
    }
}
