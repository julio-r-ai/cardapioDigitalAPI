import { Request, Response } from "express";
import { criarPedidoComLink } from "../services/pedidoService";

export const criarPedido = async (req: Request, res: Response) => {
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