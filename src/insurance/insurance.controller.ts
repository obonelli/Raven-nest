import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { InsuranceService } from './insurance.service';
import { CreateInsuranceDto } from './dto/create-insurance.dto';
import { UpdateInsuranceDto } from './dto/update-insurance.dto';

@Controller('insurance')
export class InsuranceController {
    constructor(private readonly service: InsuranceService) { }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.service.findOne(id);
    }

    @Post()
    create(@Body() dto: CreateInsuranceDto) {
        return this.service.create(dto);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() dto: UpdateInsuranceDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.service.remove(id);
    }
}
