import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { DBDeck } from "./deck";
import { DBFeedback } from "./feedback";

@Entity({ name: "User" })
export class DBUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { unique: true })
  username: string;

  @Column("varchar", { unique: true })
  email: string;

  @Column("varchar")
  password: string;

  @Column("varchar")
  salt: string;

  @OneToMany((type) => DBDeck, (deck) => deck.user)
  decks: DBDeck[];

  @OneToMany((type) => DBFeedback, (fb) => fb.user)
  feedbacks: DBFeedback[];

  serialize = () => {
    return { username: this.username };
  };
}
