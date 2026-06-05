import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { registerSchema, loginSchema } from '../validations/auth.schema';

//controller que coordina el registro, login y perfil del usuario.
//Llama al schema para validar los datos enviados por medio de zod
//y luego llama al service con su función correspondiente, guardando el resultado en res.
export const authController = {
    register: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = registerSchema.parse(req.body);
            const user = await authService.register(dto);
            res.status(201).json({ user });
        } catch (err) {
            next(err);
        }
    },

    login: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = loginSchema.parse(req.body);
            const result = await authService.login(dto);
            res.json(result);
        } catch (err) {
            next(err);
        }
    },

    me: (req: Request, res: Response) => {
        res.json({ user: req.user });
    },
};