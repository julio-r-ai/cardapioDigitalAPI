import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Usuario } from "../entities/Usuario";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();
const usuarioRepo = AppDataSource.getRepository(Usuario);

router.post("/register", async (req: Request, res: Response) => {
    const { nome, email, senha } = req.body;

    const existing = await usuarioRepo.findOneBy({ email });
    if (existing){ 
        res.status(400).json({ message: "Email já cadastrado" }); 
        return
    }

    const hashedSenha = await bcrypt.hash(senha, 10);
    const usuario = usuarioRepo.create({ nome, email, senha: hashedSenha });

    const savedUser = await usuarioRepo.save(usuario);
    res.json({ id: savedUser.id, nome: savedUser.nome, email: savedUser.email });
});

router.post("/login", async (req: Request, res: Response) => {
    const { email, senha } = req.body;

    const usuario = await usuarioRepo.findOneBy({ email });
    if (!usuario){ 
        res.status(404).json({ message: "Usuário não encontrado" }); 
        return
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida){ 
        res.status(401).json({ message: "Senha incorreta" });
        return
    }

    const token = jwt.sign(
        { userId: usuario.id, email: usuario.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
    );

    res.json({ token });
});

export default router;