import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Instructor } from "./entities/Instructor";
import { Course } from "./entities/Course";
import { Category } from "./entities/Category";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "test",
    password: "test",
    database: "test",
    synchronize: true,
    logging: false,
    entities: [User, Instructor, Course, Category],
    subscribers: [],
    migrations: [],
});