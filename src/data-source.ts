import { DataSource } from "typeorm";
import { Restaurante } from "./entities/Restaurante";
import { Categoria } from "./entities/Categoria";
import { Produto } from "./entities/Produto";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    entities: [Restaurante, Categoria, Produto],
});