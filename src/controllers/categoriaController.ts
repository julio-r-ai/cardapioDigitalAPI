import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Categoria } from "../entities/Categoria";
import { Restaurante } from "../entities/Restaurante";

const categoriaRepo = AppDataSource.getRepository(Categoria);
const restauranteRepo = AppDataSource.getRepository(Restaurante);

export const categoriaControllers = {
    
    criarCategorias: async (req: Request, res: Response) => {
      
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
    
    },

    buscarCategorias: async (req: Request, res: Response)=>{
      const categorias = await categoriaRepo.find({ relations: ['restaurante'], });
    
      res.json(categorias);
    },

    buscarCategoria: async (req: Request, res: Response)=>{
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
    },

    alterarCategoria: async (req: Request, res: Response) => {
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
    },

    deletarCategoria: async (req: Request, res: Response) => {
        const { id } = req.params;

        const categoria = await categoriaRepo.findOneBy({ id: Number(id) });

        if (!categoria) {
            res.status(404).json({ message: 'Categoria não encontrada' });
            return;
        }

        await categoriaRepo.remove(categoria);

        res.json({ message: 'Categoria deletada com sucesso' });
    }

}