import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SolicitudCanalDto {
    @IsString()
    @IsNotEmpty()
    nombre!: string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsOptional()
    @IsString()
    idCanalPadre?: string;
}
