import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePublicacionDto {
    @IsOptional()
    @IsString()
    titulo?: string;

    @IsNotEmpty()
    @IsString()
    contenido!: string;

    @IsUUID()
    idCanal!: string;

    @IsOptional()
    @IsUUID()
    idPublicacionPadre?: string | null;
}
