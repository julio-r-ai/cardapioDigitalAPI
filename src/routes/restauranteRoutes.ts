import { Router, Request, Response } from "express";
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
  const restaurantes = await restauranteRepo.find();
  res.json(restaurantes);
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const restaurante = await restauranteRepo.findOneBy({ id: Number(id) });

  if (!restaurante) {
    res.status(404).json({ message: "Restaurante não encontrado" });
    return
  }

  res.json(restaurante);
});

router.put("/:id", async (req: Request, res:Response) => {
  const { id } = req.params;

  let restaurante = await restauranteRepo.findOneBy({ id: Number(id) });

  if (!restaurante) {
    res.status(404).json({ message: "Restaurante não encontrado" });
    return
  }

  restauranteRepo.merge(restaurante, req.body);
  const result = await restauranteRepo.save(restaurante);

  res.json(result);
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const restaurante = await restauranteRepo.findOneBy({ id: Number(id) });

  if (!restaurante) {
    res.status(404).json({ message: "Restaurante não encontrado" });
    return
  }

  await restauranteRepo.remove(restaurante);

  res.json({ message: "Restaurante deletado com sucesso" });
});

export default router;