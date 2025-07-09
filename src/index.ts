import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import restauranteRoutes from './routes/restauranteRoutes';
import categoriaRoutes from './routes/categoriaRoutes';
import produtoRoutes from './routes/produtoRoutes';
import pedidoRoutes from './routes/pedidoRoutes';

const app = express();
app.use(express.json());

app.use("/restaurantes", restauranteRoutes);
app.use("/categorias", categoriaRoutes);
app.use("/produtos", produtoRoutes);
app.use("/pedidos", pedidoRoutes);
app.use("/pedidos/:id", pedidoRoutes);

const PORT = 3000;

AppDataSource.initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch((error) => console.log(error));