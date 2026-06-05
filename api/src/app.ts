import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { corsOptions } from './config/cors';
import { globalRateLimiter } from './middlewares/rateLimiter';
import { errorHandler } from './middlewares/errorHandler';
import { notFoundHandler } from './middlewares/notFoundHandler';
import authRoutes from './routes/auth.routes';
import sedeRoutes from './routes/sede.routes';
import estudianteRoutes from './routes/estudiante.routes';
import statsRoutes from './routes/stats.routes';

const app = express();

app.use(globalRateLimiter)

app.use(helmet());

app.use(cors(corsOptions));

app.use(express.json({ limit: '100kb' }));

app.use(express.urlencoded({ extended: true, limit: '100kb' }));

//endpoint para verificar que la api está en correcto funcionamiento.
app.get('/health', (_req, res) => {

    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

//endpoints
app.use('/api/auth', authRoutes);
app.use('/api/sedes', sedeRoutes);
app.use('/api/estudiantes', estudianteRoutes);
app.use('/api/stats', statsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);


export default app;
