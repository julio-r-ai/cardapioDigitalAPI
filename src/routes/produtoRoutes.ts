import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("Lista de produtos");
});

export default router;