import { AppDataSource } from "../data-source";
import { Pedido } from "../entities/Pedido";
import { PedidoItem } from "../entities/PedidoItem";
import { Produto } from "../entities/Produto";
import { Restaurante } from "../entities/Restaurante";

interface NovoPedidoInput {
  nome: string;
  sobrenome: string;
  whatsapp: string;
  observacao?: string;
  restauranteId: number;
  itens: { produtoId: number; quantidade: number }[];
}

export const criarPedidoComLink = async (dados: NovoPedidoInput) => {
  const pedidoRepo = AppDataSource.getRepository(Pedido);
  const itemRepo = AppDataSource.getRepository(PedidoItem);
  const produtoRepo = AppDataSource.getRepository(Produto);
  const restauranteRepo = AppDataSource.getRepository(Restaurante);

  const restaurante = await restauranteRepo.findOne({
    where: { id: dados.restauranteId }
  });

  if (!restaurante) throw new Error("Restaurante não encontrado");

  const pedido = pedidoRepo.create({
    nome: dados.nome,
    sobrenome: dados.sobrenome,
    whatsapp: dados.whatsapp,
    observacao: dados.observacao,
    restaurante,
  });

  pedido.itens = [];

  for (const item of dados.itens) {
    const produto = await produtoRepo.findOneBy({ id: item.produtoId });
    if (!produto) continue;

    const novoItem = itemRepo.create({
      produto,
      quantidade: item.quantidade,
      pedido,
    });

    pedido.itens.push(novoItem);
  }

  await pedidoRepo.save(pedido);

  // Gerar link WhatsApp
  const linkWhatsapp = gerarLinkWhatsapp(pedido, restaurante);

  return { pedido, linkWhatsapp };
};

function gerarLinkWhatsapp(pedido: Pedido, restaurante: Restaurante): string {
  const numeroDestino = restaurante.numeroWhatsapp.replace(/\D/g, "");
  const itensTexto = pedido.itens.map(item => {
    return `- ${item.quantidade}x ${item.produto.nome}`;
  }).join("\n");

  const mensagem = `
Olá, meu nome é ${pedido.nome} ${pedido.sobrenome}.
Gostaria de fazer um pedido:

${itensTexto}

Observações: ${pedido.observacao || "Nenhuma"}

Meu número de WhatsApp: ${pedido.whatsapp}
`.trim();

  const textoCodificado = encodeURIComponent(mensagem);
  return `https://wa.me/${numeroDestino}?text=${textoCodificado}`;
}