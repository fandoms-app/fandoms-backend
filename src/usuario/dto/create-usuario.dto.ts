import { IsEmail, IsNotEmpty, IsString, MinLength, IsDateString, IsOptional } from 'class-validator';

export class CreateUsuarioDto {
    @IsString()
    @IsNotEmpty()
    nombreUsuario!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6)
    password!: string;

    @IsDateString()
    fechaNacimiento!: string; // se convierte a date en el service

    @IsOptional()
    @IsString()
    avatar?: string;

    @IsOptional()
    @IsString()
    bio?: string;
}
