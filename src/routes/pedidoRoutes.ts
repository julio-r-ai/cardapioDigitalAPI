import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Pedido } from "../entities/Pedido";
import { Restaurante } from "../entities/Restaurante";
import { Produto } from "../entities/Produto";
import { ItemPedido } from "../entities/ItemPedido";

const router = Router();
const pedidoRepo = AppDataSource.getRepository(Pedido);
const restauranteRepo = AppDataSource.getRepository(Restaurante);
const produtoRepo = AppDataSource.getRepository(Produto);

router.post("/", async (req: Request, res: Response) => {
    const { restauranteId, itens } = req.body;

    const restaurante = await restauranteRepo.findOneBy({ id: restauranteId });
    if (!restaurante) { 
        res.status(404).json({ message: "Restaurante não encontrado" });
    } else {
        const novoPedido = pedidoRepo.create({
          status: "Pendente",
            itens: [],
                 restaurante,
     });

        let erroProduto = false;

        for (const item of itens) {
            const produto = await produtoRepo.findOneBy({ id: Number(item.produtoId) });
            if (!produto) {
                res.status(404).json({ message: `Produto ID ${item.produtoId} não encontrado` });
                erroProduto = true;
                break;
            } else {
                const itemPedido = new ItemPedido();
                itemPedido.produto = produto;
                itemPedido.quantidade = item.quantidade;

                novoPedido.itens.push(itemPedido);
            }
        }

        if (!erroProduto) {
            const resultado = await pedidoRepo.save(novoPedido);
            res.json(resultado);
        }
    }
});

router.get("/", async (req: Request, res: Response) => {
    const pedidos = await pedidoRepo.find({ relations: ["restaurante", "itens", "itens.produto"] });
    res.json(pedidos);
});

export default router;