//middleware para el manejo centralizado de errores: 400,404,409,500
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

//clase para errores personalizados.
export class AppError extends Error {
    constructor(
        public statusCode:
            //código de estado HTTP.
            number,
        //mensaje de error.
        message: string,
    ) {
        super(message);
        this.name = 'AppError';
    }
}

//función que le da manejo a los errores. 
//Cuenta con 3 tipos de errores:
//1. ZodError (validación de estructura)
//2. AppError (Errores personalizados)
//3. Prisma.PrismaClientKnownRequestError (Errores de BD por prisma)

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction,): void {
    //si el error es zodError
    if (err instanceof ZodError) {
        res.status(400).json({
            error: 'Datos inválidos',
            details: err.errors.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
            })),
        });
        return;
    }

    //si el error es personalizado
    if (err instanceof AppError) {
        res.status(err.statusCode).json({ error: err.message });
        return;
    }

    //si el error es de base de datos.
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        //P2002: violación de restricción unique
        if (err.code === 'P2002') {
            res.status(409).json({ error: 'Ya existe un registro con ese dato único.' });
            return;
        }

        //P2025: registro no encontrado
        if (err.code === 'P2025') {
            res.status(404).json({ error: 'Registro no encontrado.' });
            return;
        }
    }

    console.error('[ERROR]', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
}