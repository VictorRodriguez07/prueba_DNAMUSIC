import { useEffect, useState } from 'react';
import { sedeService } from '../services/api';
import type { Sede } from '../types';

interface SedeForm {
    nombre: string;
    ciudad: string;
    direccion: string;
    estado: 'ACTIVA' | 'INACTIVA';
}

const EMPTY_FORM: SedeForm = {
    nombre: '',
    ciudad: '',
    direccion: '',
    estado: 'ACTIVA',
};

export default function SedesPage() {
    const [sedes, setSedes] = useState<Sede[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [editingSede, setEditingSede] = useState<Sede | null>(null);
    const [form, setForm] = useState<SedeForm>(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');

    // Delete
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchSedes = async () => {
        try {
            const data = await sedeService.getAll();
            // Soporta tanto { data: [...] } como array directo
            setSedes(Array.isArray(data) ? data : data.data ?? []);
        } catch {
            setError('No se pudieron cargar las sedes.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSedes();
    }, []);

    const openCreate = () => {
        setEditingSede(null);
        setForm(EMPTY_FORM);
        setFormError('');
        setShowModal(true);
    };

    const openEdit = (sede: Sede) => {
        setEditingSede(sede);
        setForm({
            nombre: sede.nombre,
            ciudad: sede.ciudad,
            direccion: sede.direccion,
            estado: sede.estado,
        });
        setFormError('');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingSede(null);
        setForm(EMPTY_FORM);
        setFormError('');
    };

    const handleSave = async () => {
        if (!form.nombre.trim() || !form.ciudad.trim() || !form.direccion.trim()) {
            setFormError('Todos los campos son obligatorios.');
            return;
        }
        setSaving(true);
        setFormError('');
        try {
            if (editingSede) {
                await sedeService.update(editingSede.id, form);
                setSuccess('Sede actualizada correctamente.');
            } else {
                await sedeService.create(form);
                setSuccess('Sede creada correctamente.');
            }
            closeModal();
            fetchSedes();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: unknown) {
            const e = err as { response?: { data?: { error?: string } } };
            setFormError(e.response?.data?.error ?? 'Error al guardar la sede.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('¿Eliminar esta sede? Esta acción no se puede deshacer.')) return;
        setDeletingId(id);
        try {
            await sedeService.delete(id);
            setSuccess('Sede eliminada.');
            fetchSedes();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: unknown) {
            const e = err as { response?: { data?: { error?: string } } };
            setError(e.response?.data?.error ?? 'Error al eliminar la sede.');
            setTimeout(() => setError(''), 4000);
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#B8B8C2', paddingTop: '40px' }}>
                <div className="spinner" />
                Cargando sedes...
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
                <div>
                    <h1 style={{ fontSize: '22px', marginBottom: '4px' }}>Sedes</h1>
                    <p style={{ color: '#6B6B78', fontSize: '14px' }}>{sedes.length} sede{sedes.length !== 1 ? 's' : ''} registrada{sedes.length !== 1 ? 's' : ''}</p>
                </div>
                <button
                    onClick={openCreate}
                    style={{
                        backgroundColor: '#FF6A00',
                        color: '#0B0B0D',
                        padding: '9px 18px',
                        borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#E55E00')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FF6A00')}
                >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Nueva sede
                </button>
            </div>

            {/* Alerts */}
            {error && <div className="alert alert-error" style={{ marginBottom: '16px' }}>{error}</div>}
            {success && <div className="alert alert-success" style={{ marginBottom: '16px' }}>{success}</div>}

            {/* Tabla */}
            <div style={{ backgroundColor: '#16161A', border: '1px solid #2A2A31', borderRadius: '12px', overflow: 'hidden' }}>
                {sedes.length === 0 ? (
                    <div style={{ padding: '48px', textAlign: 'center', color: '#6B6B78' }}>
                        No hay sedes registradas aún.
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Ciudad</th>
                                <th>Dirección</th>
                                <th>Estado</th>
                                <th style={{ textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sedes.map((sede) => (
                                <tr key={sede.id}>
                                    <td style={{ color: '#F5F5F2', fontWeight: 500 }}>{sede.nombre}</td>
                                    <td>{sede.ciudad}</td>
                                    <td style={{ maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {sede.direccion}
                                    </td>
                                    <td>
                                        <span className={`badge ${sede.estado === 'ACTIVA' ? 'badge-activo' : 'badge-inactivo'}`}>
                                            {sede.estado}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button
                                                onClick={() => openEdit(sede)}
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    border: '1px solid #2A2A31',
                                                    color: '#B8B8C2',
                                                    padding: '5px 12px',
                                                    borderRadius: '6px',
                                                    fontSize: '12px',
                                                }}
                                                onMouseEnter={e => {
                                                    e.currentTarget.style.borderColor = '#4A9EFF';
                                                    e.currentTarget.style.color = '#4A9EFF';
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.borderColor = '#2A2A31';
                                                    e.currentTarget.style.color = '#B8B8C2';
                                                }}
                                            >Editar</button>
                                            <button
                                                onClick={() => handleDelete(sede.id)}
                                                disabled={deletingId === sede.id}
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    border: '1px solid #2A2A31',
                                                    color: '#B8B8C2',
                                                    padding: '5px 12px',
                                                    borderRadius: '6px',
                                                    fontSize: '12px',
                                                }}
                                                onMouseEnter={e => {
                                                    e.currentTarget.style.borderColor = '#D94B4B';
                                                    e.currentTarget.style.color = '#D94B4B';
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.borderColor = '#2A2A31';
                                                    e.currentTarget.style.color = '#B8B8C2';
                                                }}
                                            >
                                                {deletingId === sede.id ? '...' : 'Eliminar'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(4px)',
                }}>
                    <div style={{
                        backgroundColor: '#16161A',
                        border: '1px solid #2A2A31',
                        borderRadius: '16px',
                        padding: '28px',
                        width: '100%',
                        maxWidth: '440px',
                        animation: 'fadeIn 0.2s ease forwards',
                    }}>
                        <h2 style={{ fontSize: '18px', marginBottom: '24px' }}>
                            {editingSede ? 'Editar sede' : 'Nueva sede'}
                        </h2>

                        {formError && (
                            <div className="alert alert-error" style={{ marginBottom: '16px', fontSize: '13px' }}>{formError}</div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label>Nombre</label>
                                <input
                                    value={form.nombre}
                                    onChange={e => setForm({ ...form, nombre: e.target.value })}
                                    placeholder="Ej: Sede Norte"
                                />
                            </div>
                            <div>
                                <label>Ciudad</label>
                                <input
                                    value={form.ciudad}
                                    onChange={e => setForm({ ...form, ciudad: e.target.value })}
                                    placeholder="Ej: Bogotá"
                                />
                            </div>
                            <div>
                                <label>Dirección</label>
                                <input
                                    value={form.direccion}
                                    onChange={e => setForm({ ...form, direccion: e.target.value })}
                                    placeholder="Ej: Calle 80 # 45-20"
                                />
                            </div>
                            <div>
                                <label>Estado</label>
                                <select value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value as 'ACTIVA' | 'INACTIVA' })}>
                                    <option value="ACTIVA">Activa</option>
                                    <option value="INACTIVA">Inactiva</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '24px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={closeModal}
                                style={{
                                    backgroundColor: 'transparent',
                                    border: '1px solid #2A2A31',
                                    color: '#B8B8C2',
                                    padding: '9px 20px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                }}
                            >Cancelar</button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                style={{
                                    backgroundColor: '#FF6A00',
                                    color: '#0B0B0D',
                                    padding: '9px 20px',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    opacity: saving ? 0.7 : 1,
                                }}
                            >
                                {saving ? 'Guardando...' : editingSede ? 'Actualizar' : 'Crear sede'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}