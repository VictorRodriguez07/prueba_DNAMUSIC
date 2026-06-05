import { useNavigate } from 'react-router-dom';
import logo from '../assets/logoDNA.png';

export default function Navbar() {
    const navigate = useNavigate();
    const userRaw = localStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav style={{
            backgroundColor: '#16161A',
            borderBottom: '1px solid #2A2A31',
            padding: '0 2rem',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 100,
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img
                    src={logo}
                    alt="DNA Music"
                    style={{ width: '48px', height: '48px' }}
                />

                <span
                    style={{
                        color: '#F5F5F2',
                        fontWeight: 600,
                        fontSize: '16px',
                    }}
                >
                    DNA Music
                </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {user && (
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#F5F5F2', fontSize: '14px' }}>{user.nombre}</div>
                        <div style={{
                            color: user.role === 'ADMIN' ? '#FF6A00' : '#B8B8C2',
                            fontSize: '11px',
                            fontWeight: 600,
                        }}>{user.role}</div>
                    </div>
                )}
                <button onClick={handleLogout} style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #2A2A31',
                    color: '#B8B8C2',
                    padding: '6px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    transition: 'all 0.2s',
                }}
                    onMouseEnter={e => {
                        (e.target as HTMLButtonElement).style.borderColor = '#D94B4B';
                        (e.target as HTMLButtonElement).style.color = '#D94B4B';
                    }}
                    onMouseLeave={e => {
                        (e.target as HTMLButtonElement).style.borderColor = '#2A2A31';
                        (e.target as HTMLButtonElement).style.color = '#B8B8C2';
                    }}
                >
                    Cerrar sesión
                </button>
            </div>
        </nav>
    );
}