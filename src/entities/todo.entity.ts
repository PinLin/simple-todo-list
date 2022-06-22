import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Todo {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    completed: boolean;

    @ManyToOne(type => User, user => user.todos, { onDelete: 'CASCADE' })
    owner: User;
}
