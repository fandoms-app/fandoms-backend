export class PublicacionResponseDto {
    id!: string;
    titulo?: string | null;
    contenido!: string;
    mediaUrl?: string | null;
    fechaCreacion!: Date;
    idUsuario!: string;
    idCanal!: string;
    idPublicacionPadre?: string | null;
    comentarios?: PublicacionResponseDto[];
    nombreUsuario?: string;
    avatarUsuario?: string | null;
    comentariosCount?: number;
}
