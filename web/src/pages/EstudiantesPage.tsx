import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { estudianteService, sedeService } from '../services/api';
import type { Estudiante, Sede, Meta } from '../types';
import Navbar from '../components/Navbar';

const estadoColor: Record<string, string> = {
    ACTIVO: '#2ED47A',
    INACTIVO: '#F5A623',
    RETIRADO: '#D94B4B',
};

const estadoBg: Record<string, string> = {
    ACTIVO: '#0a1f14',
    INACTIVO: '#1f160a',
    RETIRADO: '#1a0a0a',
};

export default function EstudiantesPage() {
    const navigate = useNavigate();
    const userRaw = localStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;

    const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
    const [sedes, setSedes] = useState<Sede[]>([]);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [filtroSede, setFiltroSede] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    const fetchEstudiantes = async () => {
        setLoading(true);
        try {
            const params: Record<string, unknown> = { page, limit: 10 };
            if (filtroSede) params.sedeId = filtroSede;
            if (filtroEstado) params.estado = filtroEstado;
            if (search) params.search = search;

            const data = await estudianteService.getAll(params);
            setEstudiantes(data.data);
            setMeta(data.meta);
        } catch {
            setError('Error al cargar estudiantes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role === 'ADMIN') {
            sedeService.getAll().then(data => setSedes(data.data || data));
        }
    }, []);

    useEffect(() => {
        fetchEstudiantes();
    }, [page, filtroSede, filtroEstado, search]);

    const handleDelete = async (id: string, nombre: string) => {
        if (!confirm(`¿Eliminar a ${nombre}?`)) return;
        try {
            await estudianteService.delete(id);
            fetchEstudiantes();
        } catch {
            alert('Error al eliminar');
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0B0B0D', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <Navbar />

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                        <h1 style={{ color: '#F5F5F2', fontSize: '22px', fontWeight: 700, margin: 0 }}>
                            Estudiantes
                        </h1>
                        <p style={{ color: '#B8B8C2', fontSize: '13px', marginTop: '4px' }}>
                            {meta ? `${meta.total} estudiantes en total` : ''}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/crear')}
                        style={{
                            backgroundColor: '#FF6A00',
                            color: '#0B0B0D',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '10px 20px',
                            fontSize: '13px',
                            fontWeight: 700,
                            cursor: 'pointer',
                        }}
                    >
                        + Nuevo estudiante
                    </button>
                </div>

                {/* Filtros */}
                <div style={{
                    backgroundColor: '#16161A',
                    border: '1px solid #2A2A31',
                    borderRadius: '10px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    gap: '1rem',
                    flexWrap: 'wrap',
                }}>
                    <input
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        style={inputStyle}
                    />

                    {user?.role === 'ADMIN' && (
                        <select
                            value={filtroSede}
                            onChange={e => { setFiltroSede(e.target.value); setPage(1); }}
                            style={inputStyle}
                        >
                            <option value="">Todas las sedes</option>
                            {sedes.map(s => (
                                <option key={s.id} value={s.id}>{s.nombre}</option>
                            ))}
                        </select>
                    )}

                    <select
                        value={filtroEstado}
                        onChange={e => { setFiltroEstado(e.target.value); setPage(1); }}
                        style={inputStyle}
                    >
                        <option value="">Todos los estados</option>
                        <option value="ACTIVO">Activo</option>
                        <option value="INACTIVO">Inactivo</option>
                        <option value="RETIRADO">Retirado</option>
                    </select>
                </div>

                {/* Tabla */}
                <div style={{
                    backgroundColor: '#16161A',
                    border: '1px solid #2A2A31',
                    borderRadius: '10px',
                    overflow: 'hidden',
                }}>
                    {loading ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#B8B8C2' }}>
                            Cargando...
                        </div>
                    ) : error ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#D94B4B' }}>{error}</div>
                    ) : estudiantes.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#B8B8C2' }}>
                            No hay estudiantes registrados.
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #2A2A31' }}>
                                    {['Nombre', 'Email', 'Programa', 'Sede', 'Estado', 'Acciones'].map(h => (
                                        <th key={h} style={{
                                            padding: '12px 16px',
                                            textAlign: 'left',
                                            color: '#B8B8C2',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {estudiantes.map((est, i) => (
                                    <tr key={est.id} style={{
                                        borderBottom: i < estudiantes.length - 1 ? '1px solid #2A2A31' : 'none',
                                        transition: 'background 0.15s',
                                    }}
                                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1e1e24')}
                                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                                    >
                                        <td style={tdStyle}>
                                            <div style={{ color: '#F5F5F2', fontWeight: 500 }}>{est.nombreCompleto}</div>
                                            <div style={{ color: '#B8B8C2', fontSize: '12px' }}>{est.documentoIdentidad}</div>
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={{ color: '#B8B8C2', fontSize: '13px' }}>{est.email}</span>
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={{ color: '#B8B8C2', fontSize: '13px' }}>{est.programa}</span>
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={{ color: '#F5F5F2', fontSize: '13px' }}>{est.sede?.nombre ?? '-'}</span>
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={{
                                                backgroundColor: estadoBg[est.estado],
                                                color: estadoColor[est.estado],
                                                border: `1px solid ${estadoColor[est.estado]}30`,
                                                padding: '3px 10px',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                fontWeight: 600,
                                            }}>{est.estado}</span>
                                        </td>
                                        <td style={tdStyle}>
                                            <button
                                                onClick={() => handleDelete(est.id, est.nombreCompleto)}
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    border: '1px solid #2A2A31',
                                                    color: '#D94B4B',
                                                    padding: '4px 12px',
                                                    borderRadius: '6px',
                                                    fontSize: '12px',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Paginación */}
                {meta && meta.pages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '1rem' }}>
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            style={pageButtonStyle(page === 1)}
                        >← Anterior</button>
                        <span style={{ color: '#B8B8C2', padding: '6px 12px', fontSize: '13px' }}>
                            {page} / {meta.pages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(meta.pages, p + 1))}
                            disabled={page === meta.pages}
                            style={pageButtonStyle(page === meta.pages)}
                        >Siguiente →</button>
                    </div>
                )}
            </div>
        </div>
    );
}

const inputStyle: React.CSSProperties = {
    backgroundColor: '#0B0B0D',
    border: '1px solid #2A2A31',
    borderRadius: '8px',
    padding: '8px 12px',
    color: '#F5F5F2',
    fontSize: '13px',
    outline: 'none',
    minWidth: '180px',
};

const tdStyle: React.CSSProperties = {
    padding: '14px 16px',
    verticalAlign: 'middle',
};

const pageButtonStyle = (disabled: boolean): React.CSSProperties => ({
    backgroundColor: disabled ? '#16161A' : '#2A2A31',
    border: '1px solid #2A2A31',
    color: disabled ? '#B8B8C2' : '#F5F5F2',
    padding: '6px 16px',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: disabled ? 'not-allowed' : 'pointer',
});