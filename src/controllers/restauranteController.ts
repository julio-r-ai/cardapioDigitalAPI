import { Request, Response, NextFunction } from "express";
import { Restaurante } from "../entities/Restaurante";
import { AppDataSource } from "../data-source";
import { Usuario } from "../entities/Usuario";

const restauranteRepo = AppDataSource.getRepository(Restaurante);

export const restauranteControllers = {

    criarRestaurante: async (req: Request, res: Response, next: NextFunction)=> {
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
    },

    buscarRestaurantes: async (req: Request, res: Response) => {
      const restaurantes = await restauranteRepo.find();
      res.json(restaurantes);
    },

    buscarRestaurante: async (req: Request, res: Response) => {
      const { id } = req.params;
    
      const restaurante = await restauranteRepo.findOneBy({ id: Number(id) });
    
      if (!restaurante) {
        res.status(404).json({ message: "Restaurante não encontrado" });
        return
      }
    
      res.json(restaurante);
    },

    alterarRestaurante: async (req: Request, res:Response) => {
      const { id } = req.params;
    
      let restaurante = await restauranteRepo.findOneBy({ id: Number(id) });
    
      if (!restaurante) {
        res.status(404).json({ message: "Restaurante não encontrado" });
        return
      }
    
      restauranteRepo.merge(restaurante, req.body);
      const result = await restauranteRepo.save(restaurante);
    
      res.json(result);
    },

    deletarRestaurante: async (req: Request, res: Response) => {
  const { id } = req.params;

  const restaurante = await restauranteRepo.findOneBy({ id: Number(id) });

  if (!restaurante) {
    res.status(404).json({ message: "Restaurante não encontrado" });
    return
  }

  await restauranteRepo.remove(restaurante);

  res.json({ message: "Restaurante deletado com sucesso" });
    }
}