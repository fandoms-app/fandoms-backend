import { IsOptional, IsString } from 'class-validator';

export class UpdateCanalDto {
    @IsOptional()
    @IsString()
    nombreCanal?: string;

    @IsOptional()
    @IsString()
    descripcion?: string;
}
