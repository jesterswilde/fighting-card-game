import { Entity, PrimaryColumn, ManyToMany, JoinTable } from "typeorm";
import { DBCard } from "./card";

@Entity()
export class DBFightingStyle{
    @PrimaryColumn()
    name: string

    @ManyToMany(type => DBCard, card => card.styles)
    @JoinTable()
    cards: DBCard[]
}