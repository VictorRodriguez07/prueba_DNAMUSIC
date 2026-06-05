export interface User {
    id: string;
    nombre: string;
    email: string;
    role: 'ADMIN' | 'OPERADOR';
    sedeId?: string;
}

export interface Sede {
    id: string;
    nombre: string;
    ciudad: string;
    direccion: string;
    estado: 'ACTIVA' | 'INACTIVA';
}

export interface Estudiante {
    id: string;
    nombreCompleto: string;
    email: string;
    telefono: string;
    documentoIdentidad: string;
    sedeId: string;
    programa: string;
    estado: 'ACTIVO' | 'INACTIVO' | 'RETIRADO';
    fechaInscripcion: string;
    sede?: {
        id: string;
        nombre: string;
        ciudad: string;
    };
}

export interface Meta {
    total: number;
    page: number;
    limit: number;
    pages: number;
}

export interface AuthResponse {
    token: string;
    user: User;
}