import { Category } from "@/database/type-orm/entities/Category";
import { CategoriesRepository } from "./categories-repository";
import { categoryRepository } from "@/database/type-orm/repositories/category-repository";


export class TypeOrmCategoriesRepository implements CategoriesRepository {
    async create(category: Category) {
        const categoryCreated = await categoryRepository.save({
            ...category
        });

        return categoryCreated;
    }
    async findById(id: string) {
        const category = await categoryRepository.findOneBy({
            id
        });

        return category;
    }
}