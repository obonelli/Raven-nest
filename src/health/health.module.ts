import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

// Minimal Health module — no Terminus dependency
@Module({
    controllers: [HealthController],
})
export class HealthModule { }
