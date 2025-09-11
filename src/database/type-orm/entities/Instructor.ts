import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, JoinColumn, OneToMany, PrimaryColumn } from "typeorm";
import { Course } from "./Course";
import { User } from "./User";

export enum InstructorStatus {
    ACTIVE = "active",
    PENDING = "pending",
    SUSPENDED = "suspended",
    BANNED = "banned"
}

@Entity()
export class Instructor {
  @PrimaryColumn("uuid", { name: "user_id" })
  userId!: string;

  @OneToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({
    type: "enum",
    enum: InstructorStatus,
    default: InstructorStatus.PENDING
  })
  status!: InstructorStatus;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "update_at" })
  updatedAt!: Date;

  @OneToMany(() => Course, course => course.instructor)
  courses!: Course[];
}
