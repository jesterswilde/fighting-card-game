import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne } from "typeorm";
import { DBCard } from "./card";
import { DBUser } from "./user";
import { DBFightingStyle } from "./fightingStyle";

@Entity()
export class DBDeck {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    name: string
    
    @ManyToMany(type => DBCard)
    @JoinTable()
    cards: DBCard[]

    @ManyToMany(type => DBFightingStyle)
    @JoinTable()
    styles: DBFightingStyle[]

    @ManyToOne(type => DBUser, user => user.decks)
    user: DBUser
}