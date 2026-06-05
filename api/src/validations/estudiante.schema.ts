
import { z } from 'zod';

export const createEstudianteSchema = z.object({
    nombreCompleto: z.string().min(2).max(150),
    email: z.string().email(),
    telefono: z.string().min(7).max(20),
    documentoIdentidad: z.string().min(5).max(20),
    sedeId: z.string().cuid(),
    programa: z.string().min(2).max(150),
    estado: z.enum(['ACTIVO', 'INACTIVO', 'RETIRADO']).optional(),
    fechaInscripcion: z.coerce.date().optional(),
});

export const updateEstudianteSchema = createEstudianteSchema.partial();

export const listEstudiantesSchema = z.object({
    sedeId: z.string().cuid().optional(),
    estado: z.enum(['ACTIVO', 'INACTIVO', 'RETIRADO']).optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(10),
});

export type CreateEstudianteDto = z.infer<typeof createEstudianteSchema>;
export type UpdateEstudianteDto = z.infer<typeof updateEstudianteSchema>;
export type ListEstudiantesDto = z.infer<typeof listEstudiantesSchema>;