import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { DBDeck } from "./deck";
import { DBFeedback } from "./feedback";

@Entity({ name: "User" })
export class DBUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @OneToMany(type => DBDeck, deck => deck.user)
  decks: DBDeck[];

  @OneToMany(type => DBFeedback, fb => fb.user)
  feedbacks: DBFeedback[];

  serialize = () => {
    return { username: this.username };
  };
}
