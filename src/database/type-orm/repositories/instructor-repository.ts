import { AppDataSource } from "../data-source";
import { Instructor } from "../entities/Instructor";

export const instructorRepository = AppDataSource.getRepository(Instructor);