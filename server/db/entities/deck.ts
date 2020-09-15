import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne } from "typeorm";
import { DBUser } from "./user";
import { Deck } from "../../decks/interface";

@Entity({name: 'Deck'})
export class DBDeck {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ default: "New Deck" })
    name: string

    @Column({ default: "Undecided" })
    description: string

    @Column("text", { array: true, default: "{}" })
    cards: string[]

    @Column("text", { array: true, default: "{}" })
    styles: string[]

    @ManyToOne(type => DBUser, user => user.decks)
    user: DBUser
    toDeck = (): Deck => {
        return {
            id: this.id,
            name: this.name,
            deckList: this.cards,
            styles: this.styles,
            description: this.description
        }
    }
}