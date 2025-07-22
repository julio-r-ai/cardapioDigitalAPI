import { Router } from "express";

import { categoriaControllers } from "../controllers/categoriaController";

const router = Router();

router.post("/", categoriaControllers.criarCategorias);

router.get('/', categoriaControllers.buscarCategorias);

router.get('/:id', categoriaControllers.buscarCategoria);

router.put('/:id', categoriaControllers.alterarCategoria);

router.delete('/:id', categoriaControllers.deletarCategoria);

export default router;