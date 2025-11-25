import {
    Injectable,
    ConflictException,
    NotFoundException,
    InternalServerErrorException,
    BadRequestException,
    ForbiddenException
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Prisma, RolGlobal, Usuario } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';
import { UsuarioResponseDto } from './dto/usuario-response.dto';
import { OkResponseDto } from 'src/common/dto/ok-response.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UploadApiResponse } from 'cloudinary';
import { admin } from 'src/firebase/firebase-admin.config';

function parseFechaNacimiento(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
}

@Injectable()
export class UsuarioService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cloudinaryService: CloudinaryService
    ) {}

    private toResponse(user: Usuario): UsuarioResponseDto {
        const { passwordHash, ...safe } = user;
        return safe;
    }

    async assignRole(id: string, rol: RolGlobal, requesterId: string): Promise<UsuarioResponseDto> {
        const requester = await this.prisma.usuario.findUnique({ where: { id: requesterId } });
        if (!requester) throw new NotFoundException('Usuario solicitante no encontrado');

        const target = await this.prisma.usuario.findUnique({ where: { id } });
        if (!target) throw new NotFoundException('Usuario objetivo no encontrado');

        if (requesterId === id) {
            throw new ForbiddenException('No podés cambiar tu propio rol');
        }

        if (requester.rol === 'moderador' && target.rol === 'admin') {
            throw new ForbiddenException('No podés modificar el rol de un admin');
        }

        if (requester.rol === 'moderador' && rol === 'admin') {
            throw new ForbiddenException('Los moderadores no pueden asignar admin');
        }

        const updated = await this.prisma.usuario.update({
            where: { id },
            data: { rol }
        });

        return this.toResponse(updated);
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
                fechaNacimiento: parseFechaNacimiento(dto.fechaNacimiento),
                rol: RolGlobal.usuario,
                firebaseUid: dto.firebaseUid ?? null
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
            avatar: dto.avatar === '' ? null : dto.avatar,
            bio: dto.bio === '' ? null : dto.bio,
            fechaNacimiento: dto.fechaNacimiento ? parseFechaNacimiento(dto.fechaNacimiento) : undefined,
            ...(passwordHash ? { passwordHash } : {})
        };

        const user = await this.prisma.usuario.update({
            where: { id },
            data
        });

        return this.toResponse(user);
    }

    async remove(id: string): Promise<void> {
        const user = await this.prisma.usuario.findUnique({ where: { id } });

        if (!user) throw new NotFoundException('Usuario no encontrado');

        if (user.firebaseUid) {
            try {
                await admin.auth().deleteUser(user.firebaseUid);
            } catch (err) {
                console.error('Error eliminando usuario de Firebase:', err);
                throw new InternalServerErrorException('No se pudo eliminar en Firebase');
            }
        }

        try {
            await this.prisma.usuario.delete({ where: { id } });
        } catch {
            throw new ConflictException('No se pudo eliminar el usuario, puede tener datos relacionados');
        }
    }

    async follow(followerId: string, targetId: string): Promise<OkResponseDto> {
        if (followerId === targetId) {
            throw new ConflictException('No podés seguirte a vos mismo');
        }

        try {
            await this.prisma.seguimientoUsuario.create({
                data: { idSeguidor: followerId, idSeguido: targetId }
            });
            return { ok: true };
        } catch (err) {
            if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
                throw new ConflictException('Ya seguís a este usuario');
            }
            throw new InternalServerErrorException('Error al seguir al usuario');
        }
    }

    async unfollow(followerId: string, targetId: string): Promise<OkResponseDto> {
        const result = await this.prisma.seguimientoUsuario.deleteMany({
            where: { idSeguidor: followerId, idSeguido: targetId }
        });

        if (result.count === 0) {
            throw new NotFoundException('No seguías a este usuario');
        }

        return { ok: true };
    }

    async getFollowers(userId: string) {
        const seguidores = await this.prisma.seguimientoUsuario.findMany({
            where: { idSeguido: userId },
            include: { seguidor: true }
        });
        return seguidores.map((s) => this.toResponse(s.seguidor));
    }

    async getFollowing(userId: string) {
        const seguidos = await this.prisma.seguimientoUsuario.findMany({
            where: { idSeguidor: userId },
            include: { seguido: true }
        });
        return seguidos.map((s) => this.toResponse(s.seguido));
    }

    async findProfile(id: string) {
        const user = await this.prisma.usuario.findUnique({
            where: { id },
            include: {
                publicaciones: true,
                seguidores: true,
                seguidos: true
            }
        });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        return {
            ...this.toResponse(user),
            publicacionesCount: user.publicaciones.length,
            seguidoresCount: user.seguidores.length,
            seguidosCount: user.seguidos.length
        };
    }

    async search(query: string) {
        if (!query || query.trim().length < 2) {
            return [];
        }

        const users = await this.prisma.usuario.findMany({
            where: {
                nombreUsuario: {
                    contains: query,
                    mode: 'insensitive'
                }
            },
            take: 5
        });

        const canales = await this.prisma.canal.findMany({
            where: {
                nombreCanal: {
                    contains: query,
                    mode: 'insensitive'
                }
            },
            take: 5
        });

        return {
            usuarios: users.map((u) => this.toResponse(u)),
            canales: canales.map((c) => ({
                id: c.id,
                nombreCanal: c.nombreCanal,
                descripcion: c.descripcion
            }))
        };
    }

    async uploadAvatar(userId: string, file: Express.Multer.File): Promise<UsuarioResponseDto> {
        if (!file) throw new BadRequestException('Debe subir una imagen válida');

        const result: UploadApiResponse = await this.cloudinaryService.uploadImage(file, 'avatars');

        const updatedUser = await this.prisma.usuario.update({
            where: { id: userId },
            data: { avatar: result.secure_url }
        });

        return this.toResponse(updatedUser);
    }
}
