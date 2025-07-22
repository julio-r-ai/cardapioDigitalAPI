import { Router, Request, Response, NextFunction } from "express";
import { authMiddleware } from "../middleware/authMiddleware";

import { restauranteControllers } from "../controllers/restauranteController";

const router = Router();

router.post("/", authMiddleware, restauranteControllers.criarRestaurante);
/* router.post("/", async (req, res) => {
    const restaurante = restauranteRepo.create(req.body);

    const result = await restauranteRepo.save(restaurante);
    res.json(result);
}); */
router.get("/", restauranteControllers.buscarRestaurantes);
router.get("/:id", restauranteControllers.buscarRestaurante);
router.put("/:id", restauranteControllers.alterarRestaurante);
router.delete("/:id", restauranteControllers.deletarRestaurante);

export default router;