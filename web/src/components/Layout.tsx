import Sidebar from './Sidebar';

interface User {
    id: string;
    nombre: string;
    email: string;
    role: 'ADMIN' | 'OPERADOR';
    sedeId?: string;
}

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const userRaw = localStorage.getItem('user');
    const user: User | null = userRaw ? JSON.parse(userRaw) : null;

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: '#0B0B0D',
        }}>
            <Sidebar user={user} />

            <main style={{
                flex: 1,
                overflowY: 'auto',
                minWidth: 0,
            }}>
                <div style={{
                    padding: '32px',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    animation: 'fadeIn 0.25s ease forwards',
                }}>
                    {children}
                </div>
            </main>
        </div>
    );
}