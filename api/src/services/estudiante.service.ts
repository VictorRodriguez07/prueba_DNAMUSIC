
import { estudianteRepository } from '../repositories/estudiante.repository';
import { AppError } from '../middlewares/errorHandler';
import { JwtPayload } from '../types';
import {
    CreateEstudianteDto,
    UpdateEstudianteDto,
    ListEstudiantesDto,
} from '../validations/estudiante.schema';

export const estudianteService = {
    getAll: async (filters: ListEstudiantesDto, requester: JwtPayload) => {

        //si el usuario es operador, se declara y asigna valor al sedeIdForced
        //Si no, se asigna undefined.
        const sedeIdForced = requester.role === 'OPERADOR'
            ? (requester.sedeId ?? undefined)
            : undefined;

        const [data, total] = await estudianteRepository.findMany({
            ...filters,
            sedeIdForced,
        });

        //Se retorna los estudiantes y la metadata para las siguientes paginaciones:
        //total de estudiantes, página actual, límite, y al final calcula el número total de páginas.
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

    getById: async (id: string, requester: JwtPayload) => {
        const estudiante = await estudianteRepository.findById(id);
        if (!estudiante) throw new AppError(404, 'Estudiante no encontrado.');

        if (requester.role === 'OPERADOR' && estudiante.sedeId !== requester.sedeId) {
            throw new AppError(403, 'No tienes acceso a este estudiante.');
        }

        return estudiante;
    },

    create: async (dto: CreateEstudianteDto, requester: JwtPayload) => {
        if (requester.role === 'OPERADOR' && dto.sedeId !== requester.sedeId) {
            throw new AppError(403, 'Solo puedes crear estudiantes en tu sede.');
        }
        return estudianteRepository.create(dto);
    },

    update: async (id: string, dto: UpdateEstudianteDto, requester: JwtPayload) => {
        const estudiante = await estudianteService.getById(id, requester);

        if (requester.role === 'OPERADOR' && dto.sedeId && dto.sedeId !== requester.sedeId) {
            throw new AppError(403, 'No puedes reasignar estudiantes a otra sede.');
        }

        return estudianteRepository.update(estudiante.id, dto);
    },

    delete: async (id: string, requester: JwtPayload) => {
        const estudiante = await estudianteService.getById(id, requester);
        return estudianteRepository.softDelete(estudiante.id);
    },
};