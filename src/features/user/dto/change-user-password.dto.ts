import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeUserPasswordDto {
  @ApiProperty({
      description: "The old password before changing",
      minLength: 12,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(12)
  oldPassword: string;

  @ApiProperty({
    description: "The new password after changing",
    minLength: 12,
})
  @IsString()
  @IsNotEmpty()
  @MinLength(12)
  newPassword: string;
}
