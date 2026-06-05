import { Prisma } from '@prisma/client';
import { prisma } from '../prisma/prisma.client';
import { CreateEstudianteDto, UpdateEstudianteDto, ListEstudiantesDto } from '../validations/estudiante.schema';

export const estudianteRepository = {

    //funcion que permite consultar los estudiantes con filtros opcionales. Se recibe sedeIdForced
    //para aplicar filtros en caso de que el usuario sea un OPERADOR.
    findMany: (filters: ListEstudiantesDto & { sedeIdForced?: string }) => {
        const { sedeId, sedeIdForced, estado, search, page, limit } = filters;
        const skip = (page - 1) * limit;

        const where: Prisma.EstudianteWhereInput = {
            //solo consultar estudiantes no eliminados
            deletedAt: null,

            //Si llega un sedeIdForec, se aplica al wehere, de lo contrario, validar si existe un sedeId y aplicarlo al where
            //Si no llega ninguno de los dos, no se aplica el filtro al where
            ...(sedeIdForced ? { sedeId: sedeIdForced } : sedeId ? { sedeId } : {}),

            //Si llega un estado, se aplica al where, si no, no se aplica el filtro al where
            ...(estado ? { estado } : {}),

            //Si llega un search, se agrega el siguiente or al where. aplicando filtro por búsqueda
            ...(search ? {
                OR: [
                    { nombreCompleto: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { documentoIdentidad: { contains: search, mode: 'insensitive' } },
                ],
            } : {}),
        };

        return Promise.all([
            prisma.estudiante.findMany({
                where,
                include: { sede: { select: { id: true, nombre: true, ciudad: true } } },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.estudiante.count({ where }),
        ]);
    },

    findById: (id: string) =>
        prisma.estudiante.findFirst({
            where: { id, deletedAt: null },
            include: { sede: true },
        }),

    create: (data: CreateEstudianteDto) =>
        prisma.estudiante.create({
            data,
            include: { sede: { select: { id: true, nombre: true, ciudad: true } } },
        }),

    update: (id: string, data: UpdateEstudianteDto) =>
        prisma.estudiante.update({
            where: { id },
            data,
            include: { sede: { select: { id: true, nombre: true, ciudad: true } } },
        }),

    softDelete: (id: string) =>
        prisma.estudiante.update({
            where: { id },
            data: { deletedAt: new Date() },
        }),
};