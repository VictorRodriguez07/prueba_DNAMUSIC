import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { estudianteService, sedeService } from '../services/api';
import type { Sede } from '../types';
import Navbar from '../components/Navbar';

export default function CrearEstudiantePage() {
    const navigate = useNavigate();
    const userRaw = localStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;

    const [sedes, setSedes] = useState<Sede[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        nombreCompleto: '',
        email: '',
        telefono: '',
        documentoIdentidad: '',
        sedeId: user?.role === 'OPERADOR' ? user.sedeId : '',
        programa: '',
        estado: 'ACTIVO',
        fechaInscripcion: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        sedeService.getAll().then(data => {
            const lista = data.data || data;
            setSedes(lista);
            if (user?.role === 'OPERADOR' && user.sedeId) {
                setForm(f => ({ ...f, sedeId: user.sedeId }));
            }
        });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // Validar y parsear la fecha de forma segura
            const parsedDate = form.fechaInscripcion ? new Date(form.fechaInscripcion) : new Date();
            const dateIso = isNaN(parsedDate.getTime()) ? new Date().toISOString() : parsedDate.toISOString();

            await estudianteService.create({
                ...form,
                fechaInscripcion: dateIso,
            });
            navigate('/estudiantes');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } } };
            setError(error.response?.data?.error || 'Error al crear estudiante');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0B0B0D', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <Navbar />

            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem 1rem' }}>

                {/* Header */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <button
                        onClick={() => navigate('/estudiantes')}
                        style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#B8B8C2',
                            fontSize: '13px',
                            cursor: 'pointer',
                            padding: 0,
                            marginBottom: '1rem',
                        }}
                    >
                        ← Volver
                    </button>
                    <h1 style={{ color: '#F5F5F2', fontSize: '22px', fontWeight: 700, margin: 0 }}>
                        Nuevo estudiante
                    </h1>
                    <p style={{ color: '#B8B8C2', fontSize: '13px', marginTop: '4px' }}>
                        Completa los datos del estudiante
                    </p>
                </div>

                {/* Form Card */}
                <div style={{
                    backgroundColor: '#16161A',
                    border: '1px solid #2A2A31',
                    borderRadius: '12px',
                    padding: '2rem',
                }}>
                    <form onSubmit={handleSubmit}>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

                            <div style={{ gridColumn: '1 / -1' }}>
                                <Field label="Nombre completo">
                                    <input
                                        name="nombreCompleto"
                                        value={form.nombreCompleto}
                                        onChange={handleChange}
                                        required
                                        placeholder="Juan Pablo Restrepo"
                                        style={inputStyle}
                                    />
                                </Field>
                            </div>

                            <Field label="Email">
                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="juan@mail.com"
                                    style={inputStyle}
                                />
                            </Field>

                            <Field label="Teléfono">
                                <input
                                    name="telefono"
                                    value={form.telefono}
                                    onChange={handleChange}
                                    required
                                    placeholder="3001234567"
                                    style={inputStyle}
                                />
                            </Field>

                            <Field label="Documento de identidad">
                                <input
                                    name="documentoIdentidad"
                                    value={form.documentoIdentidad}
                                    onChange={handleChange}
                                    required
                                    placeholder="1020304050"
                                    style={inputStyle}
                                />
                            </Field>

                            <Field label="Programa">
                                <input
                                    name="programa"
                                    value={form.programa}
                                    onChange={handleChange}
                                    required
                                    placeholder="Guitarra Clásica"
                                    style={inputStyle}
                                />
                            </Field>

                            <Field label="Sede">
                                <select
                                    name="sedeId"
                                    value={form.sedeId}
                                    onChange={handleChange}
                                    required
                                    disabled={user?.role === 'OPERADOR'}
                                    style={inputStyle}
                                >
                                    <option value="" disabled>Seleccionar sede</option>
                                    {sedes.map(s => (
                                        <option key={s.id} value={s.id}>{s.nombre}</option>
                                    ))}
                                </select>
                            </Field>

                            <Field label="Estado">
                                <select
                                    name="estado"
                                    value={form.estado}
                                    onChange={handleChange}
                                    style={inputStyle}
                                >
                                    <option value="ACTIVO">Activo</option>
                                    <option value="INACTIVO">Inactivo</option>
                                    <option value="RETIRADO">Retirado</option>
                                </select>
                            </Field>

                            <Field label="Fecha de inscripción">
                                <input
                                    name="fechaInscripcion"
                                    type="date"
                                    value={form.fechaInscripcion}
                                    onChange={handleChange}
                                    required
                                    style={inputStyle}
                                />
                            </Field>

                        </div>

                        {error && (
                            <div style={{
                                backgroundColor: '#1a0a0a',
                                border: '1px solid #D94B4B',
                                borderRadius: '8px',
                                padding: '10px 12px',
                                color: '#D94B4B',
                                fontSize: '13px',
                                marginTop: '1rem',
                            }}>
                                {error}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button
                                type="button"
                                onClick={() => navigate('/estudiantes')}
                                style={{
                                    flex: 1,
                                    backgroundColor: 'transparent',
                                    border: '1px solid #2A2A31',
                                    color: '#B8B8C2',
                                    borderRadius: '8px',
                                    padding: '11px',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    flex: 1,
                                    backgroundColor: loading ? '#2A2A31' : '#FF6A00',
                                    color: loading ? '#B8B8C2' : '#0B0B0D',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '11px',
                                    fontSize: '14px',
                                    fontWeight: 700,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {loading ? 'Guardando...' : 'Crear estudiante'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label style={{
                display: 'block',
                color: '#B8B8C2',
                fontSize: '13px',
                marginBottom: '6px',
                fontWeight: 500,
            }}>
                {label}
            </label>
            {children}
        </div>
    );
}

const inputStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#0B0B0D',
    border: '1px solid #2A2A31',
    borderRadius: '8px',
    padding: '10px 12px',
    color: '#F5F5F2',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
};