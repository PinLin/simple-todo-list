import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTodoDto {
    @ApiProperty({ description: "The title of todo" })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({ description: "The description of todo" })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: "The completed status of todo" })
    @IsOptional()
    @IsBoolean()
    completed?: boolean;
}
