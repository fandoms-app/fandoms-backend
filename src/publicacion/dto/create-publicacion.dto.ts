import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePublicacionDto {
    @IsOptional()
    @IsString()
    titulo?: string;

    @IsNotEmpty({ message: 'El contenido no puede estar vacío' })
    @IsString()
    contenido!: string;

    @IsUUID('4', { message: 'El ID del canal debe ser un UUID válido' })
    idCanal!: string;

    @IsOptional()
    @IsUUID('4', { message: 'El ID de la publicación padre debe ser un UUID válido' })
    idPublicacionPadre?: string | null;
}
