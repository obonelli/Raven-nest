import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsuranceService } from './insurance.service';
import { InsuranceController } from './insurance.controller';
import { InsuranceEntity } from './insurance.entity';

@Module({
    imports: [TypeOrmModule.forFeature([InsuranceEntity])],
    controllers: [InsuranceController],
    providers: [InsuranceService],
    exports: [InsuranceService],
})
export class InsuranceModule { }
