import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsValidDomain } from '../../common/validators/is-valid-domain.validator';

export class RegisterDto {
    @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'user@example.com', description: 'The email of the user' })
    @IsEmail()
    @IsValidDomain()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123', description: 'The password of the user' })
    @IsString()
    @MinLength(6)
    password: string;
}
