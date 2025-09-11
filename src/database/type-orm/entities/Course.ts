import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { Instructor } from "./Instructor";
import { Category } from "./Category";

export enum CourseDifficulty {
    BEGINNER = "beginner",
    INTERMEDIARY = "intermediary",
    ADVANCED = "advanced"
}

export enum CourseLanguage {
    PT_BR = "pt-br",
    EN_US = "en-us",
    ES_ES = "es-es",
}

@Entity()
export class Course {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column("varchar")
    title!: string;

    @Column("varchar", {
        unique: true
    })
    slug!: string;

    @Column({
        type: "enum",
        enum: CourseLanguage
    })
    language!: string;

    @Column("varchar")
    description!: string;

    @Column({
        type: "enum",
        enum: CourseDifficulty
    })
    difficulty!: CourseDifficulty;

    @CreateDateColumn({
        name: "created_at"
    })
    createdAt!: Date;

    @UpdateDateColumn({
        name: "update_at"
    })
    updatedAt!: Date;

    @ManyToOne(() => Instructor, instructor => instructor.courses)
    instructor!: Instructor;

    @ManyToOne(() => Category, category => category.courses)
    category!: Category;
}
