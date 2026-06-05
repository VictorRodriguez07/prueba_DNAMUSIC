import { prisma } from '../prisma/prisma.client';

export const authRepository = {
    findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),

    //crea un nuevo usuario.
    create: (data: {
        nombre: string;
        email: string;
        password: string;
        role?: 'ADMIN' | 'OPERADOR';
        sedeId?: string | null;
    }) => prisma.user.create({ data }),
};