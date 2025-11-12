import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CanalService } from './canal.service';
import { CreateCanalDto } from './dto/create-canal.dto';
import { UpdateCanalDto } from './dto/update-canal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user-decorator';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolGlobal } from 'generated/prisma';
import { Roles } from 'src/auth/decorators/roles-decorator';

@Controller('canales')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CanalController {
    constructor(private readonly canalService: CanalService) {}

    //crear un canal
    @Post()
    @Roles(RolGlobal.admin, RolGlobal.moderador)
    create(@Body() dto: CreateCanalDto) {
        return this.canalService.create(dto);
    }

    // devuelve todos los canales
    @Get()
    findAll() {
        return this.canalService.findAll();
    }

    // devuelve los canales que sigue el usuario logueado
    @Get('me/seguidos')
    getMyFollowed(@User() user: JwtPayload) {
        return this.canalService.getFollowedChannels(user.sub);
    }

    // devuelve los canales padre
    @Get('root')
    findRoot() {
        return this.canalService.findRoot();
    }

    // devuelve un canal por id
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.canalService.findOne(id);
    }

    // actualiza un canal por id
    @Roles(RolGlobal.admin, RolGlobal.moderador)
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateCanalDto) {
        return this.canalService.update(id, dto);
    }

    //elimina un canal por id
    @Roles(RolGlobal.admin, RolGlobal.moderador)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.canalService.remove(id);
    }

    //seguir un canal por id
    @Post(':id/follow')
    follow(@User() user: JwtPayload, @Param('id') id: string) {
        return this.canalService.follow(user.sub, id);
    }

    //dejar de seguir un canal por id
    @Delete(':id/follow')
    unfollow(@User() user: JwtPayload, @Param('id') id: string) {
        return this.canalService.unfollow(user.sub, id);
    }

    //obtener seguidores por id de canal
    @Get(':id/seguidores')
    getFollowers(@Param('id') id: string) {
        return this.canalService.getFollowers(id);
    }

    //obtener subcanales por id de canal
    @Get(':id/subcanales')
    getSubCanales(@Param('id') id: string) {
        return this.canalService.getSubCanales(id);
    }
}
