import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import restauranteRoutes from './routes/restauranteRoutes';
import categoriaRoutes from './routes/categoriaRoutes';
import produtoRoutes from './routes/produtoRoutes';
import pedidoRoutes from './routes/pedidoRoutes';
import authRoutes from './routes/authRoutes';
import { pedidoControllers } from "./controllers/pedidoController";

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/auth/register", authRoutes);

app.use("/restaurantes", restauranteRoutes);
app.use("/restaurantes/:id", restauranteRoutes);
app.use("/categorias", categoriaRoutes);
app.use("/categorias/:id", categoriaRoutes);
app.use("/produtos", produtoRoutes);
app.use("/produtos/:id", produtoRoutes);
app.use("/pedidos", pedidoRoutes);
app.use("/pedidos/:id", pedidoRoutes);
app.use("/pedidos/:id/status", pedidoRoutes);
app.use("/pedidos/status/:status", pedidoRoutes);

app.use("/pedidoWhats", pedidoControllers.criarPedidoWhatsApp);

const PORT = 3000;

AppDataSource.initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch((error) => console.log(error));