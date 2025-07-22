import { AppDataSource } from "../data-source";
import { Pedido } from "../entities/Pedido";
import { ItemPedido } from "../entities/ItemPedido";
import { Produto } from "../entities/Produto";
import { Restaurante } from "../entities/Restaurante";

interface NovoPedidoInput {
  nomeCompleto: string; // <-- atualize para bater com o campo real
  whatsapp: string;
  observacao?: string;
  restauranteId: number;
  itens: { produtoId: number; quantidade: number }[];
}

export const criarPedidoComLink = async (dados: NovoPedidoInput) => {
  const pedidoRepo = AppDataSource.getRepository(Pedido);
  const itemRepo = AppDataSource.getRepository(ItemPedido);
  const produtoRepo = AppDataSource.getRepository(Produto);
  const restauranteRepo = AppDataSource.getRepository(Restaurante);

  const restaurante = await restauranteRepo.findOne({
    where: { id: dados.restauranteId }
  });

  if (!restaurante) throw new Error("Restaurante não encontrado");

  // cria o pedido
  const pedido = pedidoRepo.create({
    nomeCompleto : dados.nomeCompleto,
    whatsapp     : dados.whatsapp,
    observacao   : dados.observacao,
    restaurante
  });

  // monta os itens
  pedido.itens = await Promise.all(
    dados.itens.map(async i => {
      const produto = await produtoRepo.findOneBy({ id: i.produtoId });
      if (!produto) throw new Error(`Produto ${i.produtoId} não encontrado`);

      return itemRepo.create({
        produto,
        quantidade: i.quantidade,
        // não precisa setar pedido: o push virá do array
      });
    })
  );

  // **um único save; o cascade insere pedido e itens**
  const pedidoSalvo = await pedidoRepo.save(pedido);

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
Olá, meu nome é ${pedido.nomeCompleto}.
Gostaria de fazer um pedido:

${itensTexto}

Observações: ${pedido.observacao || "Nenhuma"}

Meu número de WhatsApp: ${pedido.whatsapp}
`.trim();

  const textoCodificado = encodeURIComponent(mensagem);
  return `https://wa.me/${numeroDestino}?text=${textoCodificado}`;
} 