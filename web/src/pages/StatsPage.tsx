import { useEffect, useState } from 'react';
import { api } from '../services/api';

interface StatsPorSede {
    sedeId: string;
    nombreSede: string;
    total: number;
}

interface StatsPorEstado {
    estado: string;
    total: number;
}

interface SedeTop {
    sedeId: string;
    nombreSede: string;
    totalActivos: number;
}

interface StatsData {
    totalPorSede: StatsPorSede[];
    totalPorEstado: StatsPorEstado[];
    sedeConMasActivos: SedeTop | null;
}

const ESTADO_COLORS: Record<string, string> = {
    ACTIVO: '#2ECC71',
    INACTIVO: '#6B6B78',
    RETIRADO: '#D94B4B',
};

const ESTADO_BG: Record<string, string> = {
    ACTIVO: 'rgba(46,204,113,0.1)',
    INACTIVO: 'rgba(107,107,120,0.15)',
    RETIRADO: 'rgba(217,75,75,0.1)',
};

function StatCard({ label, value, sub, accent = false }: {
    label: string;
    value: string | number;
    sub?: string;
    accent?: boolean;
}) {
    return (
        <div style={{
            backgroundColor: '#16161A',
            border: `1px solid ${accent ? 'rgba(255,106,0,0.4)' : '#2A2A31'}`,
            borderRadius: '12px',
            padding: '20px 24px',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {accent && (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, #FF6A00, transparent)',
                }} />
            )}
            <div style={{ color: '#6B6B78', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                {label}
            </div>
            <div style={{ color: accent ? '#FF6A00' : '#F5F5F2', fontSize: '28px', fontWeight: 700, lineHeight: 1.1 }}>
                {value}
            </div>
            {sub && (
                <div style={{ color: '#6B6B78', fontSize: '12px', marginTop: '4px' }}>{sub}</div>
            )}
        </div>
    );
}

export default function StatsPage() {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const userRaw = localStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;
    const isAdmin = user?.role === 'ADMIN';

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/api/stats');
                setStats(res.data);
            } catch {
                setError('No se pudieron cargar las estadísticas.');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#B8B8C2', paddingTop: '40px' }}>
                <div className="spinner" />
                Cargando estadísticas...
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-error" style={{ marginTop: '24px' }}>{error}</div>;
    }

    if (!stats) return null;

    const totalEstudiantes = stats.totalPorEstado.reduce((acc, s) => acc + s.total, 0);
    const totalActivos = stats.totalPorEstado.find(s => s.estado === 'ACTIVO')?.total ?? 0;
    const maxSede = Math.max(...stats.totalPorSede.map(s => s.total), 1);

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '22px', marginBottom: '6px' }}>Estadísticas</h1>
                <p style={{ color: '#6B6B78', fontSize: '14px' }}>
                    {isAdmin ? 'Vista global de todas las sedes' : `Vista de tu sede — ${user?.nombre}`}
                </p>
            </div>

            {/* KPI cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '32px',
            }}>
                <StatCard label="Total estudiantes" value={totalEstudiantes} />
                <StatCard label="Estudiantes activos" value={totalActivos} accent />
                {isAdmin && stats.sedeConMasActivos && (
                    <StatCard
                        label="Sede más activa"
                        value={stats.sedeConMasActivos.nombreSede}
                        sub={`${stats.sedeConMasActivos.totalActivos} activos`}
                        accent
                    />
                )}
                <StatCard
                    label="Sedes registradas"
                    value={stats.totalPorSede.length}
                    sub={isAdmin ? 'todas las sedes' : 'tu sede'}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

                {/* Por estado */}
                <div style={{
                    backgroundColor: '#16161A',
                    border: '1px solid #2A2A31',
                    borderRadius: '12px',
                    padding: '24px',
                }}>
                    <h3 style={{ fontSize: '14px', color: '#B8B8C2', marginBottom: '20px', fontWeight: 600 }}>
                        Distribución por estado
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {stats.totalPorEstado.map((item) => {
                            const pct = totalEstudiantes > 0 ? Math.round((item.total / totalEstudiantes) * 100) : 0;
                            return (
                                <div key={item.estado}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                        <span style={{
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            padding: '2px 10px',
                                            borderRadius: '20px',
                                            backgroundColor: ESTADO_BG[item.estado] ?? '#2A2A31',
                                            color: ESTADO_COLORS[item.estado] ?? '#B8B8C2',
                                        }}>{item.estado}</span>
                                        <span style={{ color: '#F5F5F2', fontWeight: 600, fontSize: '14px' }}>
                                            {item.total} <span style={{ color: '#6B6B78', fontWeight: 400 }}>({pct}%)</span>
                                        </span>
                                    </div>
                                    <div style={{ height: '6px', backgroundColor: '#2A2A31', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${pct}%`,
                                            backgroundColor: ESTADO_COLORS[item.estado] ?? '#FF6A00',
                                            borderRadius: '3px',
                                            transition: 'width 0.6s ease',
                                        }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Por sede */}
                <div style={{
                    backgroundColor: '#16161A',
                    border: '1px solid #2A2A31',
                    borderRadius: '12px',
                    padding: '24px',
                }}>
                    <h3 style={{ fontSize: '14px', color: '#B8B8C2', marginBottom: '20px', fontWeight: 600 }}>
                        Estudiantes por sede
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {stats.totalPorSede.map((sede) => {
                            const pct = Math.round((sede.total / maxSede) * 100);
                            const isTop = stats.sedeConMasActivos?.sedeId === sede.sedeId;
                            return (
                                <div key={sede.sedeId}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ color: '#F5F5F2', fontSize: '13px', fontWeight: 500 }}>
                                                {sede.nombreSede}
                                            </span>
                                            {isTop && isAdmin && (
                                                <span style={{
                                                    fontSize: '10px',
                                                    backgroundColor: 'rgba(255,106,0,0.15)',
                                                    color: '#FF6A00',
                                                    padding: '1px 6px',
                                                    borderRadius: '4px',
                                                    fontWeight: 600,
                                                }}>TOP</span>
                                            )}
                                        </div>
                                        <span style={{ color: '#F5F5F2', fontWeight: 600, fontSize: '14px' }}>
                                            {sede.total}
                                        </span>
                                    </div>
                                    <div style={{ height: '6px', backgroundColor: '#2A2A31', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${pct}%`,
                                            backgroundColor: isTop ? '#FF6A00' : '#4A9EFF',
                                            borderRadius: '3px',
                                            transition: 'width 0.6s ease',
                                        }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}