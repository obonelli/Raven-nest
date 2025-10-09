import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>) { }

    create(dto: CreateUserDto) { return this.repo.save(this.repo.create(dto)); }
    findAll() { return this.repo.find(); }
    findOne(id: number) { return this.repo.findOneBy({ id }); }
    remove(id: number) { return this.repo.delete(id); }
}
