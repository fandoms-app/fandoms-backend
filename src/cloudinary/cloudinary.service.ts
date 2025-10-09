import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
    constructor(private readonly configService: ConfigService) {
        cloudinary.config({
            cloud_name: this.configService.getOrThrow<string>('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.getOrThrow<string>('CLOUDINARY_API_KEY'),
            api_secret: this.configService.getOrThrow<string>('CLOUDINARY_API_SECRET')
        });
    }

    async uploadImage(file: Express.Multer.File, folder = 'avatars'): Promise<UploadApiResponse> {
        if (!file || !file.buffer) {
            throw new InternalServerErrorException('Archivo inválido o vacío.');
        }

        return new Promise<UploadApiResponse>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
                if (error) {
                    reject(new InternalServerErrorException(`Error al subir imagen: ${error.message}`));
                    return;
                }
                if (!result) {
                    reject(new InternalServerErrorException('Cloudinary no devolvió un resultado.'));
                    return;
                }
                resolve(result);
            });

            stream.end(file.buffer);
        });
    }

    async deleteImage(publicId: string): Promise<{ result: string }> {
        try {
            const result = (await cloudinary.uploader.destroy(publicId)) as { result: string };
            return result;
        } catch (error) {
            throw new InternalServerErrorException(`Error al eliminar imagen: ${(error as Error).message}`);
        }
    }
}
