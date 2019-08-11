import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn
} from "typeorm";
import { DBUser } from "./user";

@Entity({ name: "Feedback" })
export class DBFeedback {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => DBUser, user => user.feedbacks)
  user: DBUser | null;

  @Column("text")
  feedback: string;

  @CreateDateColumn()
  date: number;
}
