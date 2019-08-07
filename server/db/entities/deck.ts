import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne } from "typeorm";
import { DBUser } from "./user";
import { PossibleCards, DeckDescription } from "../../decks/interface";

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

    sendToUser = (possibleCards: PossibleCards = {}) => {
        return {
            deck: {
                name: this.name,
                cards: this.cards,
                styles: this.styles,
                id: this.id
            },
            possibleCards
        }
    }
    toDeckDescription = (): DeckDescription => {
        return {
            name: this.name,
            deckList: this.cards,
            description: this.description
        }
    }
}