import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: "The username",
    minLength: 12,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty({
    description: "The password",
    minLength: 12,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(12)
  password: string;
}
