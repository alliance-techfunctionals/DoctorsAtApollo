import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

const tokenSecret: any = process.env.TOKEN_SECRET;

const JWT_MiddleWare = async (req: Request, res: Response , next: NextFunction) =>  {
    let token = req.headers.authorization;
    if (token)  {
        jwt.verify(token, tokenSecret , (error: any, decoded: any) => {
            if (error) {
                return res.status(401).json({
                    error: true,
                    message: error
                });
            } else {
                res.locals.jwt = decoded;
                next();
            }
        });
    } else {
        return res.status(401).json({
            error: true, 
            message: "Unauthorized User.."
        });
    }

}

export default JWT_MiddleWare;