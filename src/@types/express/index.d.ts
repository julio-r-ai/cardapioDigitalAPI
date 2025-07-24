import { Usuario } from '../../entities/Usuario';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
      };
    }
  }
}