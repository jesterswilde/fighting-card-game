import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DBDeck } from "./deck";

@Entity()
export class DBUser{
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    username: string
    
    @Column({unique: true})
    email: string

    @Column()
    password: string
    
    @Column()
    salt: string

    @OneToMany(type => DBDeck, deck => deck.user)
    decks: DBDeck[]

    serialize = ()=>{
        return {username: this.username}
    }
}