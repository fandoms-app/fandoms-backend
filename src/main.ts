import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: 'http://localhost:5173',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // elimina props extra
            forbidNonWhitelisted: true, // lanza error si mandan props extra
            transform: true // transforma tipos, por ej strings a numbers/date
        })
    );
    await app.listen(3000);
}
void bootstrap();
