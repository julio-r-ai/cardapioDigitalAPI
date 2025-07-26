import { Usuario } from "../../entities/Usuario"; // ajuste o caminho se necessário

declare global {
  namespace Express {
    interface Request {
      user?: Usuario; // ou um tipo mais genérico se for só o payload do JWT
    }
  }
}
