import { Router, Request, Response, NextFunction } from "express";
import { Restaurante } from "../entities/Restaurante";
import { AppDataSource } from "../data-source";
import { authMiddleware } from "../middleware/authMiddleware";
import { Usuario } from "../entities/Usuario";

const router = Router();
const restauranteRepo = AppDataSource.getRepository(Restaurante);

router.post("/", authMiddleware, async (req: Request, res: Response, next: NextFunction)=> {
    const { nome, descricao, logoUrl } = req.body;
    const userId = (req as any).user.userId;

    const usuarioRepo = AppDataSource.getRepository(Usuario);
    const usuario = await usuarioRepo.findOneBy({ id: userId });

    if (!usuario){
      res.status(404).json({ message: "Usuário não encontrado" });
      return
    }

    const restaurante = restauranteRepo.create({
        nome,
        descricao,
        logoUrl,
        usuario
    });

    const result = await restauranteRepo.save(restaurante);
    res.json(result);
});

/* router.post("/", async (req, res) => {
    const restaurante = restauranteRepo.create(req.body);

    const result = await restauranteRepo.save(restaurante);
    res.json(result);
}); */

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