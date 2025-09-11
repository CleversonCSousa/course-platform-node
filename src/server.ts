import { app } from "./app";
import { AppDataSource } from "./database/type-orm/data-source";

AppDataSource.initialize().then(async () => {
    
    app.listen({
        port: 3333,
    });
    
}).catch(error => console.log(error));
