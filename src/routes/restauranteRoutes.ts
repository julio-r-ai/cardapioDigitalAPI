import { Router } from "express";
import { Restaurante } from "../entities/Restaurante";
import { AppDataSource } from "../data-source";

const router = Router();
const restauranteRepo = AppDataSource.getRepository(Restaurante);

router.post("/", async (req, res) => {
    const restaurante = restauranteRepo.create(req.body);
    const result = await restauranteRepo.save(restaurante);
    res.json(result);
});

router.get("/", async (req, res) => {
    const restaurantes = await restauranteRepo.find({ relations: ["categorias"] });
    res.json(restaurantes);
});

router.put("/", (req, res) => {
  res.send("Lista de produtos");
});

router.delete("/", (req, res) => {
  res.send("Lista de produtos");
});

export default router;