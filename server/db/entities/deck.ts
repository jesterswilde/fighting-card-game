import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne } from "typeorm";
import { DBUser } from "./user";
import { Card } from "../../shared/card";
import { PossibleCards } from "../../decks/interface";
@Entity()
export class DBDeck {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    description: string

    @Column("text", { array: true })
    cards: string[]

    @Column("text", { array: true })
    styles: string[]

    @ManyToOne(type => DBUser, user => user.decks)
    user: DBUser

    sendToUser = (possibleCards?: PossibleCards) => {
        return {
            name: this.name,
            cards: this.cards,
            possibleCards,
            styles: this.styles
        }
    }
}