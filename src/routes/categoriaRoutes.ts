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

router.post("/", async (req: Request, res: Response) => {
  
  const { nome, restauranteId } = req.body;

  const restaurante = await restauranteRepo.findOneBy({ id: Number(restauranteId) });

  if (!restaurante) {
    res.status(404).json({ message: "Restaurante não encontrado" });
  } else {
    const categoria = categoriaRepo.create({
      nome,
      restaurante,
    });

    const resultado = await categoriaRepo.save(categoria);
    res.json(resultado);
  }

});

router.get('/', async (req: Request, res: Response)=>{
  const categorias = await categoriaRepo.find({ relations: ['restaurante'], });

  res.json(categorias);
});

router.get('/:id', async (req: Request, res: Response)=>{
  const { id } = req.params;

  const categoria = await categoriaRepo.findOne({
    where:{id: Number(id)},
    relations: ['restaurante']
  });

  if(!categoria){
    res.status(404).json({message: "Categoria não encontrada"});
  }else{
    res.json(categoria);
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome, restauranteId } = req.body;

  const categoria = await categoriaRepo.findOne({
    where: { id: Number(id) },
    relations: ['restaurante']
  });

  if (!categoria) {
    res.status(404).json({ message: 'Categoria não encontrada' });
    return;
  }

  if (nome) {
    categoria.nome = nome;
  }

  if (restauranteId) {
    const restaurante = await restauranteRepo.findOneBy({ id: Number(restauranteId) });
    if (!restaurante) {
      res.status(404).json({ message: 'Restaurante não encontrado' });
      return;
    }
    categoria.restaurante = restaurante;
  }

  const resultado = await categoriaRepo.save(categoria);
  res.json(resultado);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const categoria = await categoriaRepo.findOneBy({ id: Number(id) });

  if (!categoria) {
    res.status(404).json({ message: 'Categoria não encontrada' });
    return;
  }

  await categoriaRepo.remove(categoria);

  res.json({ message: 'Categoria deletada com sucesso' });
});

export default router;