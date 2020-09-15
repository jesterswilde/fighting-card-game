import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne } from "typeorm";

@Entity({name: 'Game'})
export class DBGame {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ default: "ONE_VS_ONE" })
    format: string
}