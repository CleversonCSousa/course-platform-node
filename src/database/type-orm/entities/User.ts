import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Instructor } from "./Instructor";
import { Course } from "./Course";

@Entity()
export class User {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({
        unique: true,
        type: "varchar"
    })
    email!: string;

    @Column("varchar", {
        name: "password_hash"
    })
    passwordHash!: string;

    @Column("varchar", {
        nullable: true
    })
    phone!: string | null;

    @Column("boolean", {
        name: "has_two_factor_authentication",
        default: false
    })
    hasTwoFactorAuthentication!: boolean;
    
    @Column("varchar", {
        name: "first_name"
    })
    firstName!: string;

    @Column("varchar", {
        name: "last_name"
    })
    lastName!: string;

    @Column("varchar", {
        name: "occupation",
        nullable: true,
    })
    occupation!: string | null;

    @Column("varchar", {
        unique: true
    })
        slug!: string;

    @Column("varchar", {
        nullable: true,
    })
    biography!: string | null;

    @Column("varchar", {
        name: "avatar",
        nullable: true
    })
    avatar!: string | null;

    @Column("varchar", {
        name: "banner_url",
        nullable: true
    })
    cover!: string | null;

    @CreateDateColumn({
        name: "created_at"
    })
    createdAt!: Date;

    @UpdateDateColumn({
        name: "update_at"
    })
    updatedAt!: Date;

    @OneToOne(() => Instructor, instructor => instructor.user)
    instructor!: Instructor;

    @ManyToMany(() => Course, (course) => course.courseEnrollees)
    @JoinTable({
            name: 'user_course',
            joinColumn: {
                name: "user_id",
                referencedColumnName: "id"
            },
            inverseJoinColumn: {
                name: "course_id",
                referencedColumnName: "id"
            }
    })
    enrolledCourses!: Course[]
    

}
