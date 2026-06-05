import { prisma } from '../prisma/prisma.client';

export const statsRepository = {
    totalPorSede: () => {
        return prisma.estudiante.groupBy({
            by: ['sedeId'],
            where: {
                deletedAt: null,
            },
            _count: {
                id: true,
            },
        });
    },

    totalPorEstado: () => {
        return prisma.estudiante.groupBy({
            by: ['estado'],
            where: {
                deletedAt: null,
            },
            _count: {
                id: true,
            },
        });
    },

    sedeConMasActivos: () => {
        return prisma.estudiante.groupBy({
            by: ['sedeId'],
            where: {
                deletedAt: null,
                estado: 'ACTIVO',
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
