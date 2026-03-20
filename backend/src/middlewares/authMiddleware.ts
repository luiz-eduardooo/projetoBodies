import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { NextFunction } from "express";
import { Request, Response} from "express";
import { User } from "../entity/User";
export const authMiddleware = async (req:Request, res:Response, next:NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "Token de autenticação ausente" });
    }
    const token = authHeader.split(" ")[1];
    if(!token) {
        return res.status(401).json({ error: "Token de autenticação ausente" });
    }
    try {
        const secret = process.env.JWT_SECRET ?? "" ;
        if(!secret) {
            throw new Error("JWT_SECRET não definido no .env");
        }
        const {id} = jwt.verify(token, secret) as {id:string};
        const user = await AppDataSource.getRepository(User).findOneBy({ id });
        if (!user) {
            return res.status(401).json({ error: "Usuário não encontrado" });
        }
        const {password:_, ...userData} = user;
        (req as any).user = userData
        next();
    }
    catch (error) {
        return res.status(401).json({ error: "Token de autenticação inválido" });
    }
}


export const adminMiddleware = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    const user = (req as any).user;

    if (user.role !== 'admin') {
        return res.status(403).json({ message: "Acesso negado: Apenas administradores" });
    }

    next();
};