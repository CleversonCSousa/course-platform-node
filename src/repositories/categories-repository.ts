import { Category } from "@/database/type-orm/entities/Category";

export interface CategoriesRepository {
    create(category: Category) : Promise<Category>;
    findById(id: string) : Promise<Category | null>;
}