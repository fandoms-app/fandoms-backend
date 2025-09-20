import { IsOptional, IsString, MinLength, IsEmail, IsDateString } from 'class-validator';

export class UpdateUsuarioDto {
    @IsOptional()
    @IsString()
    nombreUsuario?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    avatar?: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsDateString()
    fechaNacimiento?: string;

    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;
}
