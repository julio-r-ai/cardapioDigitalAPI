import { Router} from "express";

import { pedidoControllers } from "../controllers/pedidoController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/", pedidoControllers.criarPedido);
router.get("/", pedidoControllers.buscarPedidos);
router.get("/:id", pedidoControllers.buscarPedido);
router.put("/:id", pedidoControllers.alterarPedido);
router.delete("/:id", pedidoControllers.deletarPedido);

router.get("/status/:status", pedidoControllers.buscarStatusPedido);
router.put("/:id/status", pedidoControllers.alterarStatus);

router.get("/porRestaurante", authMiddleware, pedidoControllers.listarPorRestaurante);

export default router;