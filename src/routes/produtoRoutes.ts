import { Router, Request, Response } from "express";
import { Produto } from "../entities/Produto";
import { Categoria } from "../entities/Categoria";
import { AppDataSource } from "../data-source";

const router = Router();
const produtoRepo = AppDataSource.getRepository(Produto);
const categoriaRepo = AppDataSource.getRepository(Categoria);

router.post("/", async (req: Request, res: Response) => {
  const { nome, descricao, preco, categoriaId } = req.body;

  const produto = produtoRepo.create({
    nome,
    descricao,
    preco
  });

  const result = await produtoRepo.save(produto);
  res.status(201).json(result);
  console.log("Produto salvo:", result);
});

router.get("/", async (req: Request, res: Response) => {
  const produtos = await produtoRepo.find({
    relations: ["categoria"],
  });

  res.json(produtos);
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const produto = await produtoRepo.findOne({
    where: { id: Number(id) },
    relations: ["categoria"],
  });

  if (!produto) {
    res.status(404).json({ message: "Produto não encontrado" });
  } else {
    res.json(produto);
  }
});

// PUT - Atualizar produto
router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { nome, descricao, preco, categoriaId } = req.body;

  const produto = await produtoRepo.findOne({
    where: { id: Number(id) },
    relations: ["categoria"],
  });

  if (!produto) {
    res.status(404).json({ message: "Produto não encontrado" });
    return; // ✅ Evita continuar com 'produto' como undefined
  }

  if (nome) produto.nome = nome;
  if (descricao) produto.descricao = descricao;
  if (preco !== undefined) produto.preco = preco;

  if (categoriaId) {
    const categoria = await categoriaRepo.findOneBy({ id: Number(categoriaId) });
    if (!categoria) {
      res.status(404).json({ message: "Categoria não encontrada" });
      return; // ✅ Evita continuar com 'categoria' undefined
    }
    produto.categoria = categoria;
  }

  const result = await produtoRepo.save(produto);
  res.json(result);
});

// DELETE - Remover produto
/* router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const produto = await produtoRepo.findOneBy({ id: Number(id) });

  if (!produto) {
    res.status(404).json({ message: "Produto não encontrado" });
  }

  await produtoRepo.remove(produto);
  res.json({ message: "Produto deletado com sucesso" });
}); */

export default router;