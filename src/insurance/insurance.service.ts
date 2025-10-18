import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InsuranceEntity } from './insurance.entity';
import { CreateInsuranceDto } from './dto/create-insurance.dto';
import { UpdateInsuranceDto } from './dto/update-insurance.dto';

@Injectable()
export class InsuranceService {
    constructor(
        @InjectRepository(InsuranceEntity)
        private repo: Repository<InsuranceEntity>,
    ) { }

    findAll() {
        return this.repo.find();
    }

    findOne(id: number) {
        return this.repo.findOne({ where: { id } });
    }

    create(data: CreateInsuranceDto) {
        return this.repo.save(this.repo.create(data));
    }

    update(id: number, data: UpdateInsuranceDto) {
        return this.repo.update(id, data);
    }

    remove(id: number) {
        return this.repo.delete(id);
    }
}
