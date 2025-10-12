import { Controller, Get, Head } from '@nestjs/common';

@Controller()
export class HealthController {
    // Responds with basic app health info
    @Get('health')
    getHealth() {
        return {
            status: 'ok',
            uptime: process.uptime(),           // seconds since process started
            timestamp: new Date().toISOString(),
            env: process.env.NODE_ENV || 'development',
        };
    }

    // Responds to HEAD /health for lightweight uptime checks
    @Head('health')
    headHealth() {
        return;
    }
}
