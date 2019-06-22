import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne } from "typeorm";
import { DBUser } from "./user";
import { PossibleCards, DeckDescription } from "../../decks/interface";

@Entity()
export class DBGame {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ default: "ONE_VS_ONE" })
    format: string
}