import { z } from 'zod';

//Estructura esperada para el registro de usuarios
export const registerSchema = z.object({
    nombre: z.string().min(2).max(100),
    email: z.string().email(),
    password: z
        .string()
        .min(8)
        .max(72)
        .regex(/[A-Z]/, 'Debe tener al menos una mayúscula')
        .regex(/[0-9]/, 'Debe tener al menos un número'),
    role: z.enum(['ADMIN', 'OPERADOR']).optional(),
    sedeId: z.string().cuid().optional().nullable(),
});

//Estructura esperada para el login de usuarios.
export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;