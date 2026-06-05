import { prisma } from '../prisma/prisma.client';
import { CreateSedeDto, UpdateSedeDto } from '../validations/sede.schema';

export const sedeRepository = {
    findAll: (filters: { ciudad?: string; estado?: 'ACTIVA' | 'INACTIVA'; page: number; limit: number }) => {

        //Se aplica desestructuracción para obtener los filtros.
        const { ciudad, estado, page, limit } = filters;

        //Calcula los registros a saltar y se guardan en skip
        const skip = (page - 1) * limit;


        // Se construye un objeto `where` dinámico para aplicar únicamente
        // los filtros que el usuario haya enviado en los query params.
        // `contains` permite realizar búsquedas parciales sobre el campo ciudad.
        // `mode: 'insensitive'` hace que la búsqueda no distinga entre
        // mayúsculas y minúsculas. Si se recibe un estado, se agrega al filtro para devolver únicamente
        // las sedes con ese estado.
        const where = {
            ...(ciudad ? { ciudad: { contains: ciudad, mode: 'insensitive' as const } } : {}),
            ...(estado ? { estado } : {}),
        };

        //retorna las sedes con los filtros aplicados y el total de sedes.
        //se hace por medio de una Promise para que ambas consultas se hagan al mismo tiempo optimizando el rendimiento.
        return Promise.all([
            prisma.sede.findMany({
                where,
                orderBy: { ciudad: 'asc' },
                skip,
                take: limit,
            }),
            prisma.sede.count({ where }),
        ]);
    },

    //funcion que busca una sede por id.
    findById: (id: string) =>
        prisma.sede.findUnique({ where: { id } }),

    //funcion que crea una sede.
    create: (data: CreateSedeDto) =>
        prisma.sede.create({ data }),

    update: (id: string, data: UpdateSedeDto) =>
        prisma.sede.update({ where: { id }, data }),

    delete: (id: string) =>
        prisma.sede.delete({ where: { id } }),
};