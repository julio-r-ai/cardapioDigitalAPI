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
  const { nomeCompleto, whatsapp, restauranteId, itens, observacao } = req.body;

  const restauranteRepo = AppDataSource.getRepository(Restaurante);
  const pedidoRepo = AppDataSource.getRepository(Pedido);
  const produtoRepo = AppDataSource.getRepository(Produto);

  const restaurante = await restauranteRepo.findOneBy({ id: restauranteId });
  if (!restaurante){
    res.status(404).json({ message: "Restaurante não encontrado" });
    return
  }  

  const pedido = new Pedido();
  pedido.nomeCompleto = nomeCompleto;
  pedido.whatsapp = whatsapp;
  pedido.restaurante = restaurante;
  pedido.observacao = observacao;

  pedido.itens = [];

  for (const item of itens) {
    const produto = await produtoRepo.findOneBy({ id: item.produtoId });
    if (!produto) continue;

    const itemPedido = new ItemPedido();
    itemPedido.produto = produto;
    itemPedido.quantidade = item.quantidade;
    pedido.itens.push(itemPedido);
  }

  await pedidoRepo.save(pedido);

  res.status(201).json({ message: "Pedido realizado com sucesso", pedido });
});


/* router.post("/", async (req: Request, res: Response) => {

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

}); */

router.get("/", async (req: Request, res: Response) => {
    const pedidos = await pedidoRepo.find({ relations: ["restaurante", "itens", "itens.produto"] });
    res.json(pedidos);
});

router.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;

    const pedido = await pedidoRepo.findOne({
        where: { id: Number(id) },
        relations: ["restaurante", "itens", "itens.produto"]
    });

    if (!pedido) {
        res.status(404).json({ message: "Pedido não encontrado" });
    } else {
        res.json(pedido);
    }
});

router.get("/status/:status", async (req: Request, res: Response) => {
    const { status } = req.params;

    const pedidos = await pedidoRepo.find({
        where: { status },
        relations: ["restaurante", "itens", "itens.produto"]
    });

    res.json(pedidos);
});

router.put("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, itens } = req.body;

    const pedido = await pedidoRepo.findOne({
        where: { id: Number(id) },
        relations: ["restaurante", "itens", "itens.produto"]
    });

    if (!pedido) {
        res.status(404).json({ message: "Pedido não encontrado" });
    } else {
        if (status) {
            pedido.status = status;
        }

        if (itens && Array.isArray(itens)) {
            pedido.itens = [];

            for (const item of itens) {
                const produto = await produtoRepo.findOneBy({ id: Number(item.produtoId) });
                if (!produto) {
                    res.status(404).json({ message: `Produto ID ${item.produtoId} não encontrado` });
                    return;
                }

                const itemPedido = new ItemPedido();
                itemPedido.produto = produto;
                itemPedido.quantidade = item.quantidade;

                pedido.itens.push(itemPedido);
            }
        }

        const resultado = await pedidoRepo.save(pedido);
        res.json(resultado);
    }
});

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