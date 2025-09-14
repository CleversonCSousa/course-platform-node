
import { Category } from "@/database/type-orm/entities/Category";
import { CategoriesRepository } from "./categories-repository";

export class InMemoryCategoriesRepository implements CategoriesRepository {
    private items: Category[] = [];

    async findById(id: string) {
        const category = this.items.find(item => item.id === id);

        if(!category) {
            return null;
        }

        return category;
    }
    
    async create(category: Category) {

        this.items.push(category);
        
        return category;
    }
}