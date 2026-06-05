import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export function authorize(...roles: ('ADMIN' | 'OPERADOR')[]) {
    return (
        req: Request,
        _res: Response,
        next: NextFunction,
    ): void => {
        //Verifica si el user está autenticado
        if (!req.user) return next(new AppError(401, 'No autenticado.'));

        //verifica si el user cuenta con el rol requerido para la acción
        if (!roles.includes(req.user.role)) {
            return next(new AppError(403, 'No tienes permiso para esta acción.'));
        }
        //Pasa al siguiente middleware
        next();
    };
}