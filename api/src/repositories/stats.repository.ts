import { prisma } from '../prisma/prisma.client';

export const statsRepository = {
    totalPorSede: (sedeId?: string) => {
        return prisma.estudiante.groupBy({
            by: ['sedeId'],
            where: {
                deletedAt: null,
                ...(sedeId && { sedeId }),
            },
            _count: {
                id: true,
            },
        });
    },

    totalPorEstado: (sedeId?: string) => {
        return prisma.estudiante.groupBy({
            by: ['estado'],
            where: {
                deletedAt: null,
                ...(sedeId && { sedeId }),
            },
            _count: {
                id: true,
            },
        });
    },

    sedeConMasActivos: (sedeId?: string) => {
        return prisma.estudiante.groupBy({
            by: ['sedeId'],
            where: {
                deletedAt: null,
                estado: 'ACTIVO',
                ...(sedeId && { sedeId }),
            },
            _count: {
                id: true,
            },
            orderBy: {
                _count: {
                    id: 'desc',
                },
            },
            take: 1,
        });
    },

    todasLasSedes: () => {
        return prisma.sede.findMany({
            select: {
                id: true,
                nombre: true,
            },
        });
    },
};
