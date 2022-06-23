import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangeUserPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(12)
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(12)
  newPassword: string;
}
