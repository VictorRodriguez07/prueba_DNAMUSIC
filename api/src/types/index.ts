
export interface JwtPayload {
    userId: string;
    role: 'ADMIN' | 'OPERADOR';
    sedeId: string | null;
}
