import { Router } from "express";
import { Produto } from "../entities/Produto";
import { AppDataSource } from "../data-source";

const router = Router();
const produtoRepo = AppDataSource.getRepository(Produto);

router.post("/", async (req, res) => {
  
  const produto = produtoRepo.create(req.body);
  const result = await produtoRepo.save(produto);

  res.json(result);
});

router.get("/", (req, res) => {
  res.send("Lista de produtos");
});

router.put("/", (req, res) => {
  res.send("Lista de produtos");
});

router.delete("/", (req, res) => {
  res.send("Lista de produtos");
});

export default router; 