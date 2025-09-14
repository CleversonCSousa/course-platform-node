
import { Instructor } from "@/database/type-orm/entities/Instructor";
import { InstructorsRepository } from "./instructors-repository";

export class InMemoryInstructorsRepository implements InstructorsRepository {
    private items: Instructor[] = [];

    async findById(id: string) {
        const instructor = this.items.find(item => item.user.id === id);

        if(!instructor) {
            return null;
        }

        return instructor;
    }
    

    async create(instructor: Instructor) {

        this.items.push(instructor);
        
        return instructor;
    }
}