import {Entity, Column, PrimaryColumn} from 'typeorm';
import { Card } from '../../shared/card';

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
}