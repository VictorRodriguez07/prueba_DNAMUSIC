import { Request, Response, NextFunction } from 'express';
import { estudianteService } from '../services/estudiante.service';
import {
    createEstudianteSchema,
    updateEstudianteSchema,
    listEstudiantesSchema,
} from '../validations/estudiante.schema';
import { JwtPayload } from '../types';

export const estudianteController = {
    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filters = listEstudiantesSchema.parse(req.query);
            const result = await estudianteService.getAll(filters, req.user as JwtPayload);
            res.json(result);
        } catch (err) {
            next(err);
        }
    },

    getById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const estudiante = await estudianteService.getById(req.params.id, req.user as JwtPayload);
            res.json({ estudiante });
        } catch (err) {
            next(err);
        }
    },

    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = createEstudianteSchema.parse(req.body);
            const estudiante = await estudianteService.create(dto, req.user as JwtPayload);
            res.status(201).json({ estudiante });
        } catch (err) {
            next(err);
        }
    },

    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = updateEstudianteSchema.parse(req.body);
            const estudiante = await estudianteService.update(req.params.id, dto, req.user as JwtPayload);
            res.json({ estudiante });
        } catch (err) {
            next(err);
        }
    },

    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await estudianteService.delete(req.params.id, req.user as JwtPayload);
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    },
};