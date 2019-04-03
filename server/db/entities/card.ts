import {Entity, Column, PrimaryColumn, ManyToMany} from 'typeorm';
import { Card } from '../../shared/card';
import { DBFightingStyle } from './fightingStyle';

@Entity()
export class DBCard {
    constructor(cardObj?: Card){
        if(cardObj){
            this.name = cardObj.name; 
            this.card = cardObj; 
        }
    }

    @PrimaryColumn()
    name: string

    @Column("json")
    card: Card

    @ManyToMany(type => DBFightingStyle, style => style.cards)
    styles: DBFightingStyle[]
}