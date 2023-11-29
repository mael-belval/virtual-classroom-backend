import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const githubSecret = env.JWT_SECRET;
    if (!githubSecret) {
        throw new Error("JWT_SECRET is not defined");
    }

    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Auth token is missing" });
        }

        const decodedToken = jwt.verify(token, githubSecret);
        req.user = decodedToken; // Ajoutez les informations décodées à l'objet requête
        next();
    } catch (error) {
        console.error(error);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
