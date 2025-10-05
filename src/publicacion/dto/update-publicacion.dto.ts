import { IsOptional, IsString } from 'class-validator';

export class UpdatePublicacionDto {
    @IsOptional()
    @IsString()
    titulo?: string;

    @IsOptional()
    @IsString()
    contenido?: string;
}
