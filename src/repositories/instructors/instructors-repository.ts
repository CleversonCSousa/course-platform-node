import { Instructor } from "@/database/type-orm/entities/Instructor";

export interface InstructorsRepository {
    create(instructor: Instructor) : Promise<Instructor>;
    findById(id: string) : Promise<Instructor | null>;
}