import { Module } from '@nestjs/common';
import { CanalService } from './canal.service';
import { CanalController } from './canal.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [CanalController],
    providers: [CanalService],
    exports: [CanalService]
})
export class CanalModule {}
