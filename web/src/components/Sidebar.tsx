import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logoDNA.png';

interface User {
    id: string;
    nombre: string;
    email: string;
    role: 'ADMIN' | 'OPERADOR';
    sedeId?: string;
}

interface SidebarProps {
    user: User | null;
}

const NAV_ITEMS = [
    {
        label: 'Estudiantes',
        icon: (
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
        path: '/estudiantes',
        roles: ['ADMIN', 'OPERADOR'],
        subItems: [
            { label: 'Listado', path: '/estudiantes' },
            { label: 'Nuevo estudiante', path: '/crear' },
        ],
    },
    {
        label: 'Sedes',
        icon: (
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
        ),
        path: '/sedes',
        roles: ['ADMIN'],
        subItems: [
            { label: 'Listado', path: '/sedes' },
        ],
    },
    {
        label: 'Estadísticas',
        icon: (
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
        ),
        path: '/stats',
        roles: ['ADMIN', 'OPERADOR'],
        subItems: [],
    },
];

export default function Sidebar({ user }: SidebarProps) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const visibleItems = NAV_ITEMS.filter(
        (item) => user && item.roles.includes(user.role)
    );

    return (
        <aside style={{
            width: '240px',
            minWidth: '240px',
            backgroundColor: '#16161A',
            borderRight: '1px solid #2A2A31',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            position: 'sticky',
            top: 0,
            overflow: 'hidden',
        }}>

            {/* Logo */}
            <div
                style={{
                    padding: '20px 20px 16px',
                    borderBottom: '1px solid #2A2A31',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                }}
            >
                <img
                    src={logo}
                    alt="DNA Music"
                    style={{
                        width: '48px',
                        height: '48px',
                        objectFit: 'contain',
                        flexShrink: 0,
                    }}
                />

                <div>
                    <div
                        style={{
                            color: '#F5F5F2',
                            fontWeight: 700,
                            fontSize: '15px',
                            lineHeight: 1.2,
                        }}
                    >
                        DNA Music
                    </div>

                    <div
                        style={{
                            color: '#6B6B78',
                            fontSize: '11px',
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            fontWeight: 500,
                        }}
                    >
                        ERP v1.0
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
                <div style={{ marginBottom: '4px' }}>
                    <span style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        color: '#6B6B78',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        padding: '0 10px',
                        display: 'block',
                        marginBottom: '6px',
                    }}>Módulos</span>

                    {visibleItems.map((item) => (
                        <div key={item.path} style={{ marginBottom: '2px' }}>
                            {/* Item principal */}
                            <NavLink
                                to={item.path}
                                style={({ isActive }) => ({
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '9px 10px',
                                    borderRadius: '8px',
                                    color: isActive ? '#FF6A00' : '#B8B8C2',
                                    backgroundColor: isActive ? 'rgba(255,106,0,0.1)' : 'transparent',
                                    fontSize: '14px',
                                    fontWeight: isActive ? 600 : 400,
                                    textDecoration: 'none',
                                    transition: 'all 0.15s',
                                    borderLeft: isActive ? '2px solid #FF6A00' : '2px solid transparent',
                                })}
                                onMouseEnter={(e) => {
                                    const el = e.currentTarget;
                                    if (!el.className.includes('active')) {
                                        el.style.backgroundColor = '#1E1E24';
                                        el.style.color = '#F5F5F2';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    const el = e.currentTarget;
                                    if (!el.style.color.includes('rgb(255')) {
                                        el.style.backgroundColor = 'transparent';
                                        el.style.color = '#B8B8C2';
                                    }
                                }}
                            >
                                <span style={{ flexShrink: 0 }}>{item.icon}</span>
                                <span>{item.label}</span>
                            </NavLink>

                            {/* Sub-items */}
                            {item.subItems.length > 0 && (
                                <div style={{ paddingLeft: '38px', marginTop: '2px' }}>
                                    {item.subItems.map((sub) => (
                                        <NavLink
                                            key={sub.path}
                                            to={sub.path}
                                            end
                                            style={({ isActive }) => ({
                                                display: 'block',
                                                padding: '6px 10px',
                                                borderRadius: '6px',
                                                color: isActive ? '#FF6A00' : '#6B6B78',
                                                backgroundColor: isActive ? 'rgba(255,106,0,0.08)' : 'transparent',
                                                fontSize: '13px',
                                                fontWeight: isActive ? 500 : 400,
                                                textDecoration: 'none',
                                                transition: 'all 0.15s',
                                            })}
                                            onMouseEnter={(e) => {
                                                (e.currentTarget as HTMLElement).style.color = '#B8B8C2';
                                            }}
                                            onMouseLeave={(e) => {
                                                const el = e.currentTarget as HTMLElement;
                                                if (!el.style.color.includes('rgb(255')) {
                                                    el.style.color = '#6B6B78';
                                                }
                                            }}
                                        >
                                            {sub.label}
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </nav>

            {/* User footer */}
            <div style={{
                padding: '16px',
                borderTop: '1px solid #2A2A31',
            }}>
                {user && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '12px',
                    }}>
                        <div style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            backgroundColor: '#2A2A31',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '13px',
                            fontWeight: 700,
                            color: '#FF6A00',
                            flexShrink: 0,
                        }}>
                            {user.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <div style={{
                                color: '#F5F5F2',
                                fontSize: '13px',
                                fontWeight: 500,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}>{user.nombre}</div>
                            <div style={{
                                fontSize: '11px',
                                color: user.role === 'ADMIN' ? '#FF6A00' : '#4A9EFF',
                                fontWeight: 600,
                            }}>{user.role}</div>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%',
                        backgroundColor: 'transparent',
                        border: '1px solid #2A2A31',
                        color: '#6B6B78',
                        padding: '8px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                        const btn = e.currentTarget;
                        btn.style.borderColor = '#D94B4B';
                        btn.style.color = '#D94B4B';
                        btn.style.backgroundColor = 'rgba(217,75,75,0.08)';
                    }}
                    onMouseLeave={(e) => {
                        const btn = e.currentTarget;
                        btn.style.borderColor = '#2A2A31';
                        btn.style.color = '#6B6B78';
                        btn.style.backgroundColor = 'transparent';
                    }}
                >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Cerrar sesión
                </button>
            </div>
        </aside>
    );
}