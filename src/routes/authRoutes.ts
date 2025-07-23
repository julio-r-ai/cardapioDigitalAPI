import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { authControllers } from "../controllers/authController"; 

const router = Router();

router.post("/register", authControllers.readAuth);
router.post("/login",authControllers.readLogin );
router.put("/trocar-senha", authMiddleware, authControllers.trocarSenha);
router.post("/esqueci-senha", authControllers.esqueciSenha);
router.post("/redefinir-senha", authControllers.redefinirSenha);

export default router;