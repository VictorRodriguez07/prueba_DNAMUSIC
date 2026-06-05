import { statsRepository } from '../repositories/stats.repository';

export const statsService = {
    getStats: async () => {
        // Se llaman los 4 métodos del repository en paralelo con Promise.all
        const [
            porSede,
            porEstado,
            conMasActivos,
            sedes,
        ] = await Promise.all([
            statsRepository.totalPorSede(),
            statsRepository.totalPorEstado(),
            statsRepository.sedeConMasActivos(),
            statsRepository.todasLasSedes(),
        ]);

        // Crear mapa para traducción rápida: sedeId → nombre de sede
        const sedeMap = new Map<string, string>(
            sedes.map((s) => [s.id, s.nombre])
        );

        // Mapear los totales de cada sede agregando el nombre descriptivo
        const totalPorSede = porSede.map((group) => ({
            sedeId: group.sedeId,
            nombreSede: sedeMap.get(group.sedeId) || 'Sede Desconocida',
            total: group._count.id,
        }));

        // Mapear totales de estudiantes por estado
        const totalPorEstado = porEstado.map((group) => ({
            estado: group.estado,
            total: group._count.id,
        }));

        // Mapear la sede con más estudiantes activos
        const topSedeGroup = conMasActivos[0];
        const sedeConMasActivos = topSedeGroup
            ? {
                  sedeId: topSedeGroup.sedeId,
                  nombreSede: sedeMap.get(topSedeGroup.sedeId) || 'Sede Desconocida',
                  totalActivos: topSedeGroup._count.id,
              }
            : null;

        return {
            totalPorSede,
            totalPorEstado,
            sedeConMasActivos,
        };
    },
};
