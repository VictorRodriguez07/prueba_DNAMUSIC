# DNA Music — Sistema de Gestión de Estudiantes

Prueba técnica para el cargo de Desarrollador Backend Jr.

**Backend:** https://prueba-dnamusic.onrender.com  
**Frontend:** https://prueba-dnamusic.vercel.app

---

## Cómo correr el proyecto localmente

### Requisitos
- Node.js 18+
- PostgreSQL (o cuenta en Neon/Supabase)
- Git

### Backend

```bash
cd api
npm install
```

Crea un archivo `.env` basado en `.env.example`:

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="una-clave-larga-y-aleatoria"
JWT_EXPIRES_IN="8h"
PORT=3000
NODE_ENV="development"
ALLOWED_ORIGINS="http://localhost:5173"
```

```bash
npx prisma migrate dev
npx prisma db seed
npm run dev
```

El servidor queda en `http://localhost:3000`. Puedes verificar con `GET /health`.

### Frontend

```bash
cd web
npm install
```

Crea un archivo `.env.local`:

```env
VITE_API_URL=http://localhost:3000
```

```bash
npm run dev
```

La app queda en `http://localhost:5173`.

---

## Credenciales de prueba

Estas credenciales las carga el seed automáticamente.

| Rol      | Email                        | Contraseña | Acceso |
|----------|------------------------------|------------|--------|
| ADMIN    | admin@dnamusic.co            | Admin123!  | Todo   |
| OPERADOR | operador.bog@dnamusic.co     | Oper123!   | Solo Bogotá |
| OPERADOR | operador.med@dnamusic.co     | Oper123!   | Solo Medellín |

El seed también crea 3 sedes (Bogotá, Medellín, Cali) y 5 estudiantes distribuidos entre ellas con distintos estados.

---

## Diagrama de la base de datos

![Diagrama de la base de datos](/web/src/assets/diagramaBD.png)

Un OPERADOR pertenece a una sede. Solo puede ver y gestionar los estudiantes de esa sede. Un ADMIN no tiene sede asignada y tiene acceso total.

---

## Decisiones técnicas

**Express sobre NestJS o Fastify** — para una prueba técnica de este alcance y teniendo en cuenta tiempos de entrega, NestJS agrega demasiado boilerplate, tiempo de setup o estructura incial y desarrollo. Express es más directo, rápido de configurar y permite cumplir con el alcance y requerimientos del proyecto.

**Arquitectura por capas** — la request pasa por `Route → Controller → Service → Repository → Prisma`. Los controller solo manejan HTTP y coordinar el flujo de llamado a función de service y validación con Zod. El service tiene la lógica de negocio y no conoce Express. El repository es la única capa que toca Prisma y genera las transaciones con la base de datos. Esta separación hace que cada capa sea fácil de testear, mantener y escalar.

**Prisma con PostgreSQL (Neon)** — Neon ofrece PostgreSQL serverless gratuito con buena latencia. Prisma genera los tipos automáticamente desde el schema, lo que elimina una categoría entera de bugs.

**Zod para validación** — valida todos los inputs antes de que lleguen al service. Si el payload no cumple el schema, devuelve un error 400 descriptivo sin que el código de negocio tenga que preocuparse por eso.

**Singleton de PrismaClient** — en desarrollo, Next.js y ts-node recargan módulos en cada cambio. Sin el patrón de singleton con `globalThis`, cada recarga crea una nueva conexión y se agotan rápido. El singleton reutiliza la instancia existente.

---

## Decisiones de seguridad

**Lo que se implementó:**

- **bcrypt con 12 salt rounds** — 10 es el mínimo aceptable, sin embargo 12 es el estándar actual. A más rounds, más tiempo de cómputo por intento de fuerza bruta.
- **Mensajes genéricos en login** — siempre devuelve "Credenciales inválidas", nunca dice si el email existe o no. Un atacante no puede enumerar usuarios.
- **Timing attack mitigation** — aunque el usuario no exista, el sistema igual ejecuta `bcrypt.compare` contra un hash falso y añade un delay mínimo de 300ms. Esto evita que un atacante infiera si un email está registrado midiendo tiempos de respuesta.
- **Rate limiting en auth** — 10 intentos por IP cada 15 minutos en los endpoints de login y registro. Después del límite, devuelve 429. Esto se implementó con la ayuda de la librería express-rate-limit, con el método rateLimit.
- **Rate limiting global** — 200 requests por IP cada 15 minutos en toda la API.
- **Helmet** — configura headers HTTP de seguridad automáticamente (X-Frame-Options, X-Content-Type-Options, etc.).
- **CORS restringido** — solo acepta requests del origen configurado en `ALLOWED_ORIGINS`. En producción apunta únicamente al frontend en Vercel.
- **Payload limit** — requests con body mayor a 100kb son rechazados automáticamente.
- **JWT con expiración** — los tokens expiran en 8 horas. Configurable por variable de entorno.
- **Autorización por rol y por sede** — el middleware `authorize` verifica el rol. La lógica de sede se aplica en el service: si el usuario es OPERADOR, su `sedeId` se toma del token, no del body. No puede manipularlo.
- **Soft delete** — los estudiantes no se eliminan físicamente. Se marca `deletedAt` y se excluyen de todas las queries con `where: { deletedAt: null }`.
- **Password nunca se devuelve** — en ninguna respuesta de la API aparece el hash de la contraseña.

**Lo que conozco y no implementé por tiempo:**

- **Refresh tokens** — el flujo actual usa solo access token. Con más tiempo implementaría refresh tokens con rotación, almacenados en cookies httpOnly para evitar acceso desde JavaScript.
- **Cookies httpOnly** — actualmente el token se guarda en localStorage en el frontend. Es funcional pero vulnerable a XSS. La alternativa correcta es httpOnly cookie, que el navegador no expone a JavaScript.
- **Bloqueo por intentos a nivel de cuenta** — el schema de User ya tiene los campos `loginAttempts` y `blockedUntil` preparados. No alcancé a implementar la lógica que los actualiza en cada intento fallido.
- **Refresh de sesión automático** — si el token expira mientras el usuario está activo, la app lo redirige al login sin previo aviso. Con refresh tokens esto se resolvería transparentemente.

---

## Qué haría diferente con más tiempo

- Implementar refresh tokens con cookies httpOnly — es el cambio de seguridad más importante que quedó fuera.
- Agregar tests de integración para los endpoints de auth y estudiantes. Son los más críticos y los que más valor dan.
- Documentar la API con Swagger — es útil tanto para el equipo como para la entrevista.
- Implementar el bloqueo por intentos fallidos usando los campos que ya están en el schema.
- Docker Compose para que el proyecto corra con un solo comando sin necesidad de configurar PostgreSQL localmente.
- Paginación en el frontend — el backend ya la soporta pero el frontend no la usa todavía.

---

## Comandos Git relevantes usados

```bash
# Crear rama de feature
git checkout -b feature/filtro-por-sede

# Commits con conventional commits
git commit -m "feat(estudiantes): agregar filtro por sede para OPERADOR"
git commit -m "fix(auth): corregir timing attack en login"

# Subir rama al remoto
git push origin feature/filtro-por-sede

# Ver historial limpio
git log --oneline
```

---

## Uso de IA

Usé Claude como asistente durante el desarrollo. Me ayudó a generar estructura de archivos, revisar lógica de seguridad, investigación de librerías que desconocía y escribir partes del frontend. Todo el código fue revisado, entendido y ajustado por mí. En la entrevista puedo explicar cualquier decisión o línea de código del proyecto.
