import { Router} from "express";

import { pedidoControllers } from "../controllers/pedidoController";

const router = Router();

router.post("/", pedidoControllers.criarPedido);
router.get("/", pedidoControllers.buscarPedidos);
router.get("/:id", pedidoControllers.buscarPedido);
router.put("/:id", pedidoControllers.alterarPedido);
router.delete("/:id", pedidoControllers.deletarPedido);

router.get("/status/:status", pedidoControllers.buscarStatusPedido);
router.put("/:id/status", pedidoControllers.alterarStatus);

export default router;