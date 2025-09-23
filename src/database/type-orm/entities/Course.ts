import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, JoinColumn, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { Instructor } from "./Instructor";
import { Category } from "./Category";
import { User } from "./User";

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

    @Column("uuid", {
        name: 'category_id',
    })
    categoryId!: string;

    @Column("uuid", {
        name: 'instructor_id'
    })
    instructorId!: string;

    @ManyToOne(() => Instructor, instructor => instructor.courses)
    @JoinColumn({ name: "instructor_id" })
    instructor!: Instructor;

    @ManyToOne(() => Category, category => category.courses)
    @JoinColumn({ name: "category_id" })
    category!: Category;

    @ManyToMany(() => User, (user) => user.enrolledCourses)
    courseEnrollees!: User[]



}
