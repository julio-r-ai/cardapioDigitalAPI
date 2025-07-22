import { Router, Request, Response } from "express";

import { produtoControllers } from "../controllers/produtoController";

const router = Router();

router.post("/", produtoControllers.criarProduto);
router.get("/", produtoControllers.buscarProdutos);
router.get("/:id", produtoControllers.buscarProduto);
router.put("/:id", produtoControllers.alterarProduto);
router.delete("/:id", produtoControllers.deletarProduto); 

export default router;