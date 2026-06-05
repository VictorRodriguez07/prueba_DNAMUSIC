import { sedeRepository } from '../repositories/sede.repository';
import { AppError } from '../middlewares/errorHandler';
import { CreateSedeDto, ListSedesDto, UpdateSedeDto } from '../validations/sede.schema';

export const sedeService = {
    getAll: async (filters: ListSedesDto) => {
        //llama la función del repository para consultar las sedes con los filtros pasados como parámetro.
        //el resultado es guardado en un array donde se guardan las sedes retornadas por la BD
        //y el total de sedes.
        const [data, total] = await sedeRepository.findAll(filters);

        //retorna las sedes y la metadata para las siguientes paginaciones:
        //total de sedes, página actual, límite, y al final calcula el número total de paginas.
        return {
            data,
            meta: {
                total,
                page: filters.page,
                limit: filters.limit,
                pages: Math.ceil(total / filters.limit),
            },
        };
    },

    getById: async (id: string) => {
        const sede = await sedeRepository.findById(id);
        if (!sede) throw new AppError(404, 'Sede no encontrada.');
        return sede;
    },

    create: (dto: CreateSedeDto) => sedeRepository.create(dto),

    update: async (id: string, dto: UpdateSedeDto) => {
        //se llama a getById para verificar que la sede existe
        //en caso de no existir, se lanza un error.
        await sedeService.getById(id);
        //si existe, se llama a la función update del repository para actualizar la sede.
        return sedeRepository.update(id, dto);
    },

    delete: async (id: string) => {
        //se llama a getById para verificar que la sede existe
        //en caso de no existir, se lanza un error.
        await sedeService.getById(id);
        //si existe, se llama a la función delete del repository para eliminar la sede.
        return sedeRepository.delete(id);
    },
};