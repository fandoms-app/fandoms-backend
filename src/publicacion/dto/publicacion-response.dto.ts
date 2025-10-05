export class PublicacionResponseDto {
    id!: string;
    titulo?: string | null;
    contenido!: string;
    fechaCreacion!: Date;
    idUsuario!: string;
    idCanal!: string;
    idPublicacionPadre?: string | null;
}
