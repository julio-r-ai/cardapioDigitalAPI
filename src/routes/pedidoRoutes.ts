import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Pedido } from "../entities/Pedido";
import { Restaurante } from "../entities/Restaurante";
import { Produto } from "../entities/Produto";
import { ItemPedido } from "../entities/ItemPedido";

import { criarPedido } from "../controllers/pedidoController";
import { buscarPedidos } from "../controllers/pedidoController";
import { buscarPedido } from "../controllers/pedidoController";
import { buscarStatusPedido } from "../controllers/pedidoController";
import { alterarPedido } from "../controllers/pedidoController";

const router = Router();
const pedidoRepo = AppDataSource.getRepository(Pedido);
const produtoRepo = AppDataSource.getRepository(Produto);

router.post("/", criarPedido);

router.get("/", buscarPedidos);

router.get("/:id", buscarPedido);

router.get("/status/:status", buscarStatusPedido);

router.put("/:id", alterarPedido);

router.put("/:id/status", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const pedido = await pedidoRepo.findOneBy({ id: Number(id) });

    if (!pedido){
        res.status(404).json({ message: "Pedido não encontrado" });
        return 
    } 

    const statusValidos = ["Pendente", "Preparando", "Pronto", "Finalizado", "Cancelado"];

    if (!statusValidos.includes(status)) {
        res.status(400).json({ message: "Status inválido" });
        return
    }

    pedido.status = status;
    const result = await pedidoRepo.save(pedido);

    res.json(result);
});

router.delete("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;

    const pedido = await pedidoRepo.findOneBy({ id: Number(id) });

    if (!pedido) {
        res.status(404).json({ message: "Pedido não encontrado" });
    } else {
        await pedidoRepo.remove(pedido);
        res.json({ message: "Pedido deletado com sucesso" });
    }
});

export default router;