import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, JoinColumn, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { Course } from "./Course";

@Entity()
export class Category {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column("varchar", {
        unique: true
    })
    name!: string;

    @Column("varchar", {
        unique: true
    })
    slug!: string;

    @CreateDateColumn({
        name: "created_at"
    })
    createdAt!: Date;

    @UpdateDateColumn({
        name: "update_at"
    })
    updatedAt!: Date;

    @OneToMany(() => Course, course => course.category)
    courses!: Course[];

}
