import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Track {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    uri: string;

    @Column({nullable: true})
    title: string;

    @Column({nullable: true})
    album: string;

    @Column({nullable: true})
    artist: string;

    @Column({nullable: true})
    cover: string;

    @Column({nullable: true})
    hash: string;

}