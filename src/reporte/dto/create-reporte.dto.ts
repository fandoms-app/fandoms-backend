import { IsEnum, IsString, MinLength } from 'class-validator';
import { TipoReporte } from '@prisma/client';

export class CreateReporteDto {
    @IsEnum(TipoReporte)
    tipo!: TipoReporte;

    @IsString()
    @MinLength(3)
    motivo!: string;

    @IsString()
    idObjetivo!: string;
}
