import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import EstudiantesPage from './pages/EstudiantesPage';
import CrearEstudiantePage from './pages/CrearEstudiantePage';
import SedesPage from './pages/SedesPage';
import StatsPage from './pages/StatsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas protegidas con Layout (sidebar) */}
        <Route
          path="/estudiantes"
          element={
            <PrivateRoute allowedRoles={['ADMIN', 'OPERADOR']}>
              <Layout><EstudiantesPage /></Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/crear"
          element={
            <PrivateRoute allowedRoles={['ADMIN', 'OPERADOR']}>
              <Layout><CrearEstudiantePage /></Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/sedes"
          element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <Layout><SedesPage /></Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/stats"
          element={
            <PrivateRoute allowedRoles={['ADMIN', 'OPERADOR']}>
              <Layout><StatsPage /></Layout>
            </PrivateRoute>
          }
        />

        {/* Raíz → estudiantes */}
        <Route path="/" element={<Navigate to="/estudiantes" replace />} />
        <Route path="*" element={<Navigate to="/estudiantes" replace />} />
      </Routes>
    </BrowserRouter>
  );
}