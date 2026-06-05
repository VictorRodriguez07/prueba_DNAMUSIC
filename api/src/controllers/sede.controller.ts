import { Request, Response, NextFunction } from 'express';
import { sedeService } from '../services/sede.service';
import { createSedeSchema, updateSedeSchema, listSedesSchema } from '../validations/sede.schema';

export const sedeController = {

    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {

            //se validan los filtros que llegan en la query (ciudad, page, limit)
            //en caso de no haber filtro, el schema los deja con los datos por defecto
            const filters = listSedesSchema.parse(req.query);

            //Se llama a la funcion getAll del servicio pasandole los filtros
            const result = await sedeService.getAll(filters);

            //Se devuelve el resultado
            res.json(result);
        } catch (err) {
            next(err);
        }
    },

    getById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const sede = await sedeService.getById(req.params.id);
            res.json({ sede });
        } catch (err) {
            next(err);
        }
    },

    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            //Se validan los datos y son guardados en dto después de ser verificados por el schema
            const dto = createSedeSchema.parse(req.body);

            //llama a la funcion create del servicio y guarda el resultado en sede
            const sede = await sedeService.create(dto);

            //devuelve la sede creada
            res.status(201).json({ sede });
        } catch (err) {
            next(err);
        }
    },

    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            //Se validan los datos y son guardados en dto después de ser verificados por el schema
            const dto = updateSedeSchema.parse(req.body);

            //llama a la funcion update del servicio y guarda el resultado en sede
            const sede = await sedeService.update(req.params.id, dto);

            //devuelve la sede actualizada
            res.json({ sede });
        } catch (err) {
            next(err);
        }
    },

    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await sedeService.delete(req.params.id);
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    },
};