import { Request, Response } from "express";
import { criarPedidoComLink } from "../services/pedidoService";
import { AppDataSource } from "../data-source";
import { Pedido } from "../entities/Pedido";
import { Restaurante } from "../entities/Restaurante";
import { Produto } from "../entities/Produto";
import { ItemPedido } from "../entities/ItemPedido";

const pedidoRepo = AppDataSource.getRepository(Pedido);
const restauranteRepo = AppDataSource.getRepository(Restaurante);
const produtoRepo = AppDataSource.getRepository(Produto);

export const criarPedidoWhatsApp = async (req: Request, res: Response) => {
  try {
    const dados = req.body;
    const { pedido, linkWhatsapp } = await criarPedidoComLink(dados);
    res.status(201).json({
      mensagem: "Pedido criado com sucesso!",
      pedidoId: pedido.id,
      linkWhatsapp
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao criar pedido" });
  }
};

export const criarPedido = async (req: Request, res: Response) => {
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
};

export const buscarPedidos = async (req: Request, res: Response) => {
    const pedidos = await pedidoRepo.find({ relations: ["restaurante", "itens", "itens.produto"] });
    res.json(pedidos);
};

export const buscarPedido = async (req: Request, res: Response) => {
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
};

export const buscarStatusPedido = async (req: Request, res: Response) => {
    const { status } = req.params;

    const pedidos = await pedidoRepo.find({
        where: { status },
        relations: ["restaurante", "itens", "itens.produto"]
    });

    res.json(pedidos);
};

export const alterarPedido = async (req: Request, res: Response) => {
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
}