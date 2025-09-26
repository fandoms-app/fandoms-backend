import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CanalService } from './canal.service';
import { CreateCanalDto } from './dto/create-canal.dto';
import { UpdateCanalDto } from './dto/update-canal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user-decorator';
import type { JwtPayload } from '../auth/types/jwt-payload';

@Controller('canales')
export class CanalController {
    constructor(private readonly canalService: CanalService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() dto: CreateCanalDto) {
        return this.canalService.create(dto);
    }

    @Get()
    findAll() {
        return this.canalService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.canalService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateCanalDto) {
        return this.canalService.update(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.canalService.remove(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/follow')
    follow(@User() user: JwtPayload, @Param('id') id: string) {
        return this.canalService.follow(user.sub, id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id/follow')
    unfollow(@User() user: JwtPayload, @Param('id') id: string) {
        return this.canalService.unfollow(user.sub, id);
    }

    @Get(':id/seguidores')
    getFollowers(@Param('id') id: string) {
        return this.canalService.getFollowers(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me/seguidos')
    getMyFollowed(@User() user: JwtPayload) {
        return this.canalService.getFollowedByUser(user.sub);
    }

    @Get(':id/subcanales')
    getSubCanales(@Param('id') id: string) {
        return this.canalService.getSubCanales(id);
    }
}
