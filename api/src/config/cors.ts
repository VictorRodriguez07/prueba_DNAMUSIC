//Archivo para establecer las reglas de nuestro Cors
import { CorsOptions } from 'cors';

//define los origenes que se les permite comunicación al backend y les da formato. 
// Si no hay origenes, por defecto quedará "http://localhost:5173".
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim());

//función en la cual se definen las relgas del cors
export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        //si no hay origen, se permite la petición (como en local)
        if (!origin) return callback(null, true);

        //si el origen está en la lista de permitidos, se permite la petición
        if (allowedOrigins.includes(origin)) return callback(null, true);

        //si no se cumple ninguna de las condiciones anteriores, se bloquea la petición
        callback(new Error(`CORS bloqueado para origen: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}; 