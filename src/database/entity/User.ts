import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    pass: string;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP"})
    createdAt: Date

}