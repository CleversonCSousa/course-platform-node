import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, JoinColumn, OneToMany } from "typeorm";
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

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({
        type: "enum",
        enum: InstructorStatus
    })
    status!: InstructorStatus;

    @CreateDateColumn({
        name: "created_at"
    })
    createdAt!: Date;

    @UpdateDateColumn({
        name: "update_at"
    })
    updatedAt!: Date;

    @OneToOne(() => User)
    @JoinColumn({
        name: "user_id",
    })
    user!: User;

    @OneToMany(() => Course, course => course.instructor)
    courses!: Course[];

}
