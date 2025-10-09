import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ example: 'bonelli.personal@gmail.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'Nemesis100.' })
    @IsNotEmpty()
    password: string;
}
