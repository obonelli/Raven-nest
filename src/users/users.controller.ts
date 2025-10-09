import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly service: UsersService) { }

    @Post() create(@Body() dto: CreateUserDto) { return this.service.create(dto); }
    @Get() findAll() { return this.service.findAll(); }
    @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(+id); }
    @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(+id); }
}
