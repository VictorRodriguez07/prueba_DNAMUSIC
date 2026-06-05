import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import logo from '../assets/logoDNA.png';

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setEmailError('');
        setPasswordError('');

        // Frontend validations
        let valid = true;
        if (!email.trim()) {
            setEmailError('El correo electrónico es requerido.');
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Ingresa un correo electrónico válido (ej: usuario@dnamusic.co).');
            valid = false;
        }

        if (!password) {
            setPasswordError('La contraseña es requerida.');
            valid = false;
        } else if (password.length < 4) {
            setPasswordError('La contraseña debe tener al menos 4 caracteres.');
            valid = false;
        }

        if (!valid) return;

        setLoading(true);
        try {
            const data = await authService.login(email, password);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/estudiantes');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } } };
            setError(error.response?.data?.error || 'Credenciales inválidas');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#0B0B0D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'system-ui, -apple-system, sans-serif',
        }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '0 1rem' }}>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <img
                        src={logo}
                        alt="DNA Music"
                        style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'contain',
                            margin: '0 auto 1rem',
                            display: 'block',
                        }}
                    />

                    <h1
                        style={{
                            color: '#F5F5F2',
                            fontSize: '24px',
                            fontWeight: 700,
                            margin: 0,
                        }}
                    >
                        DNA Music
                    </h1>

                    <p
                        style={{
                            color: '#B8B8C2',
                            fontSize: '14px',
                            marginTop: '4px',
                        }}
                    >
                        Sistema de Gestión ERP
                    </p>
                </div>

                {/* Card */}
                <div style={{
                    backgroundColor: '#16161A',
                    border: '1px solid #2A2A31',
                    borderRadius: '12px',
                    padding: '2rem',
                }}>
                    <h2 style={{ color: '#F5F5F2', fontSize: '18px', fontWeight: 600, marginTop: 0, marginBottom: '1.5rem' }}>
                        Iniciar sesión
                    </h2>

                    <form onSubmit={handleSubmit} noValidate>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', color: '#B8B8C2', fontSize: '13px', marginBottom: '6px' }}>
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => {
                                    setEmail(e.target.value);
                                    if (emailError) setEmailError('');
                                }}
                                placeholder="admin@dnamusic.co"
                                style={{
                                    width: '100%',
                                    backgroundColor: '#0B0B0D',
                                    border: emailError ? '1px solid #D94B4B' : '1px solid #2A2A31',
                                    borderRadius: '8px',
                                    padding: '10px 12px',
                                    color: '#F5F5F2',
                                    fontSize: '14px',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    transition: 'border-color 0.25s, box-shadow 0.25s',
                                    boxShadow: emailError ? '0 0 0 3px rgba(217, 75, 75, 0.15)' : 'none',
                                }}
                            />
                            {emailError && (
                                <span style={{ display: 'block', color: '#D94B4B', fontSize: '12px', marginTop: '6px' }}>
                                    {emailError}
                                </span>
                            )}
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', color: '#B8B8C2', fontSize: '13px', marginBottom: '6px' }}>
                                Contraseña
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => {
                                    setPassword(e.target.value);
                                    if (passwordError) setPasswordError('');
                                }}
                                placeholder="••••••••"
                                style={{
                                    width: '100%',
                                    backgroundColor: '#0B0B0D',
                                    border: passwordError ? '1px solid #D94B4B' : '1px solid #2A2A31',
                                    borderRadius: '8px',
                                    padding: '10px 12px',
                                    color: '#F5F5F2',
                                    fontSize: '14px',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    transition: 'border-color 0.25s, box-shadow 0.25s',
                                    boxShadow: passwordError ? '0 0 0 3px rgba(217, 75, 75, 0.15)' : 'none',
                                }}
                            />
                            {passwordError && (
                                <span style={{ display: 'block', color: '#D94B4B', fontSize: '12px', marginTop: '6px' }}>
                                    {passwordError}
                                </span>
                            )}
                        </div>

                        {error && (
                            <div style={{
                                backgroundColor: '#1a0a0a',
                                border: '1px solid #D94B4B',
                                borderRadius: '8px',
                                padding: '10px 12px',
                                color: '#D94B4B',
                                fontSize: '13px',
                                marginBottom: '1rem',
                            }}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                backgroundColor: loading ? '#2A2A31' : '#FF6A00',
                                color: loading ? '#B8B8C2' : '#0B0B0D',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '11px',
                                fontSize: '14px',
                                fontWeight: 700,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                            }}
                        >
                            {loading ? 'Ingresando...' : 'Ingresar'}
                        </button>
                    </form>
                </div>

                <p style={{ textAlign: 'center', color: '#B8B8C2', fontSize: '12px', marginTop: '1.5rem' }}>
                    DNA Inversiones SAS — dnamusic.edu.co
                </p>
            </div>
        </div>
    );
}