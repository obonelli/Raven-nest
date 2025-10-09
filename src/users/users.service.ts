import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    async create(dto: CreateUserDto) {
        // evita duplicados
        const exists = await this.userRepo.findOne({ where: { email: dto.email } });
        if (exists) throw new ConflictException('Email already registered');

        // hash
        const hashed = await bcrypt.hash(dto.password, 10);

        const user = this.userRepo.create({
            name: dto.name,
            email: dto.email,
            password: hashed,
        });

        const saved = await this.userRepo.save(user);

        // limpia password
        const { password, ...safe } = saved as any;
        return { message: '✅ User created successfully', user: safe };
    }

    findAll() {
        return this.userRepo.find(); // password no sale por select:false
    }

    findOne(id: number) {
        return this.userRepo.findOneBy({ id }); // password no sale por select:false
    }

    async remove(id: number) {
        await this.userRepo.delete(id);
        return { ok: true };
    }
}
