import { Request, Response } from "express";
import { criarPedidoComLink } from "../services/pedidoService";
import { AppDataSource } from "../data-source";
import { Pedido } from "../entities/Pedido";
import { Restaurante } from "../entities/Restaurante";
import { Produto } from "../entities/Produto";
import { ItemPedido } from "../entities/ItemPedido";

const pedidoRepo = AppDataSource.getRepository(Pedido);
const produtoRepo = AppDataSource.getRepository(Produto);
const itemPedidoRepo = AppDataSource.getRepository(ItemPedido);

export const pedidoControllers = {

  criarPedidoWhatsApp: async (req: Request, res: Response) => {
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
  },

  criarPedido: async (req: Request, res: Response) => {
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
  },

  buscarPedidos: async (req: Request, res: Response) => {
    const pedidos = await pedidoRepo.find({ relations: ["restaurante", "itens", "itens.produto"] });
    res.json(pedidos);
  },

  buscarPedido: async (req: Request, res: Response) => {
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
  },

  buscarStatusPedido: async (req: Request, res: Response) => {
    const { status } = req.params;

    const pedidos = await pedidoRepo.find({
        where: { status },
        relations: ["restaurante", "itens", "itens.produto"]
    });

    res.json(pedidos);
  },

  alterarPedido: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, itens } = req.body;

    const pedido = await pedidoRepo.findOne({
      where: { id: Number(id) },
      relations: ["restaurante", "itens", "itens.produto"]
    });

    if (!pedido) {
      res.status(404).json({ message: "Pedido não encontrado" });
      return
    }

    if (status) {
      pedido.status = status;
    }

    if (itens && Array.isArray(itens)) {
      // Remove itens antigos
      await itemPedidoRepo.delete({ pedido: { id: pedido.id } });

      const novosItens: ItemPedido[] = [];

      for (const item of itens) {
        const produto = await produtoRepo.findOneBy({ id: Number(item.produtoId) });

        if (!produto) {
          res.status(404).json({ message: `Produto ID ${item.produtoId} não encontrado` });
          return
        }

        const itemPedido = itemPedidoRepo.create({
          produto,
          quantidade: item.quantidade,
          pedido
        });

        novosItens.push(itemPedido);
      }

      await itemPedidoRepo.save(novosItens);
      pedido.itens = novosItens;
    };

    const pedidoAtualizado = await pedidoRepo.save(pedido);
    console.log("Pedido antes de salvar:", pedido);

    // 🔒 Resposta formatada (sem referência circular)
    res.json({
      id: pedidoAtualizado.id,
      nomeCompleto: pedidoAtualizado.nomeCompleto,
      whatsapp: pedidoAtualizado.whatsapp,
      observacao: pedidoAtualizado.observacao,
      status: pedidoAtualizado.status,
      dataHora: pedidoAtualizado.dataHora,
      restaurante: {
        id: pedidoAtualizado.restaurante.id,
        nome: pedidoAtualizado.restaurante.nome
      },
      itens: pedidoAtualizado.itens.map(item => ({
        id: item.id,
        quantidade: item.quantidade,
        produto: {
          id: item.produto.id,
          nome: item.produto.nome,
          preco: item.produto.preco
        }
      }))
    });
  },

  
  alterarStatus: async (req: Request, res: Response) => {
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
  }, 

  deletarPedido: async (req: Request, res: Response) => {
    const { id } = req.params;

    const pedido = await pedidoRepo.findOneBy({ id: Number(id) });

    if (!pedido) {
        res.status(404).json({ message: "Pedido não encontrado" });
    } else {
        await pedidoRepo.remove(pedido);
        res.json({ message: "Pedido deletado com sucesso" });
    }
  }

}