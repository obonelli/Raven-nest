import { Controller, Get, Head } from '@nestjs/common';

@Controller()
export class HealthController {
    @Get('health')
    getHealth() {
        return {
            status: 'ok',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            env: process.env.NODE_ENV || 'development',
        };
    }

    @Head('health')
    headHealth() {
        return;
    }
}
