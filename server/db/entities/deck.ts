import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne } from "typeorm";
import { DBCard } from "./card";
import { DBUser } from "./user";

@Entity()
export class DBDeck {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    name: string
    
    @ManyToMany(type => DBCard)
    @JoinTable()
    cards: DBCard[]

    @ManyToOne(type => DBUser, user => user.decks)
    user: DBUser
}