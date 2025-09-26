import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCanalDto {
    @IsString()
    @IsNotEmpty()
    nombreCanal!: string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsOptional()
    @IsString()
    idCanalPadre?: string;
}
