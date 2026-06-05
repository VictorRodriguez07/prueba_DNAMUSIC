import { z } from 'zod';

export const createSedeSchema = z.object({
    nombre: z.string().min(2).max(100),
    ciudad: z.string().min(2).max(100),
    direccion: z.string().min(5).max(200),
    estado: z.enum(['ACTIVA', 'INACTIVA']).optional(),
});

//estructura esperada para listar sedes. Se definen por defecto valores para page y limit.
export const listSedesSchema = z.object({
    ciudad: z.string().optional(),
    estado: z.enum(['ACTIVA', 'INACTIVA']).optional(),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(10),
});

//Estructura esperada para actualizar una sede. Se permiten campos opcionales
//permitiendo actualizar uno o mas campos a la vez
export const updateSedeSchema = createSedeSchema.partial();

export type ListSedesDto = z.infer<typeof listSedesSchema>;
export type CreateSedeDto = z.infer<typeof createSedeSchema>;
export type UpdateSedeDto = z.infer<typeof updateSedeSchema>;