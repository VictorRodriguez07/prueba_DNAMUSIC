import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import { JwtPayload } from '../types';

//función que verifica que la petición cuente con un token válido.
export function authenticate(
    req: Request,
    _res: Response,
    next: NextFunction,
): void {
    //se guarda el token en la constante authHeader
    const authHeader = req.headers.authorization;

    //se verifica que el token no venga vacío y que tenga el formato "Bearer <token>"
    if (!authHeader?.startsWith('Bearer ')) {
        return next(new AppError(401, 'Token requerido.'));
    }

    //se separa el token del header
    const token = authHeader.split(' ')[1];

    //Se verifica que el token sea válido o que no haya expirado por medio de la funcion jwt.verify
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        req.user = payload;
        next();
    } catch {
        next(new AppError(401, 'Token inválido o expirado.'));
    }
}