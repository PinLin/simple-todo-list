import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoDto {
    @ApiProperty({ description: "The title of todo" })
    @IsString()
    title: string;

    @ApiProperty({ description: "The description of todo" })
    @IsString()
    description: string;
}
