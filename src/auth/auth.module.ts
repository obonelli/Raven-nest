import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        ConfigModule,       // already global, harmless to import here
        PassportModule,
        TypeOrmModule.forFeature([User]),

        // Register JWT with env-driven config and strict typing for expiresIn
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (cfg: ConfigService) => {
                const secret = cfg.get<string>('JWT_SECRET', 'change-me');

                // Accept both numeric seconds ("3600") and ms-like strings ("1h", "30m", "15s")
                const raw = cfg.get<string>('JWT_EXPIRES', '1h');

                let expiresIn: number | import('ms').StringValue;
                if (/^\d+$/.test(raw)) {
                    // purely digits => treat as seconds
                    expiresIn = Number(raw);
                } else {
                    // e.g. "1h", "30m", "15s" — cast to ms.StringValue for TS
                    expiresIn = raw as unknown as import('ms').StringValue;
                }

                return {
                    secret,
                    signOptions: { expiresIn },
                };
            },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [JwtModule],
})
export class AuthModule { }
