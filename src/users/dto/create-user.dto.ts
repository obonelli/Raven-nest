import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @Length(2, 120)
    name: string;

    @IsEmail()
    email: string;
}
