import { Navigate } from 'react-router-dom';

interface Props {
    children: React.ReactNode;
    allowedRoles?: ('ADMIN' | 'OPERADOR')[];
}

export default function PrivateRoute({ children, allowedRoles }: Props) {
    const token = localStorage.getItem('token');
    const userRaw = localStorage.getItem('user');

    if (!token || !userRaw) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles) {
        const user = JSON.parse(userRaw);
        if (!allowedRoles.includes(user.role)) {
            return <Navigate to="/estudiantes" replace />;
        }
    }

    return <>{children}</>;
}