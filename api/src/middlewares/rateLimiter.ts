
import rateLimit from 'express-rate-limit';

// Función que limita la cantidad de peticiones del cliente al servidor de forma global.
// Usa la función rateLimit de la biblioteca express-rate-limit, la cual se encarga de limitar la cantidad de peticiones
// según parámetros establecidos. windowMs define el tiempo de la ventana en milisegundos, max define la cantidad de peticiones permitidas por IP.
// standardHeaders y legacyHeaders definen si se deben enviar los encabezados de rate limiting, message define el mensaje de error,
// y skipSuccessfulRequests define si se deben saltar las peticiones exitosas.
export const globalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Demasiadas solicitudes. Intenta más tarde.' },
});

//Función que limita la cantidad de peticiones del cliente al servidor de forma especifica para la ruta auth.
export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Demasiados intentos de autenticación. Intenta más tarde.' },
    skipSuccessfulRequests: true,
});