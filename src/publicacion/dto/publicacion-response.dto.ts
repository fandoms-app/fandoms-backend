export class PublicacionResponseDto {
    id!: string;
    titulo?: string | null;
    contenido!: string | null;
    mediaUrl?: string | null;
    fechaCreacion!: Date;
    idUsuario!: string;
    idCanal!: string;
    idPublicacionPadre?: string | null;
    comentarios?: PublicacionResponseDto[];
    nombreUsuario?: string | null;
    avatarUsuario?: string | null;
    comentariosCount?: number;
    eliminada!: boolean;
}
