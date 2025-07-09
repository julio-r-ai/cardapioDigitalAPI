import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Categoria } from "../entities/Categoria";
import { Pedido } from "../entities/Pedido";
import { Restaurante } from "../entities/Restaurante";
import { Produto } from "../entities/Produto";
import { ItemPedido } from "../entities/ItemPedido";


const router = Router();
const categoriaRepo = AppDataSource.getRepository(Categoria);
const pedidoRepo = AppDataSource.getRepository(Pedido);
const restauranteRepo = AppDataSource.getRepository(Restaurante);
const produtoRepo = AppDataSource.getRepository(Produto);
const itemPedidoRepo = AppDataSource.getRepository(ItemPedido);

router.post("/", (req, res) => {
  res.send("Lista de categorias");
});

export default router;