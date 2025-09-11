
import { Instructor } from "@/database/type-orm/entities/Instructor";
import { instructorRepository } from "@/database/type-orm/repositories/instructor-repository";
import { InstructorsRepository } from "./instructors-repository";

export class TypeOrmInstructorsRepository implements InstructorsRepository {
    async create(instructor: Instructor) {
        const instructorCreated = await instructorRepository.save({
            ...instructor
        });

        return instructorCreated;
    }
    async findById(id: string) {
        const instructor = await instructorRepository.findOneBy({
            id
        });

        return instructor;
    }
}