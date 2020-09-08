import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Playlist {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP"})
    createdAt: Date

}