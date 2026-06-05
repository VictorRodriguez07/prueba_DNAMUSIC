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

**Express sobre NestJS o Fastify**: Para el alcance de esta prueba prioricé velocidad de desarrollo y simplicidad. Express permite implementar la arquitectura requerida sin agregar capas adicionales de abstracción. En proyectos más grandes o con equipos numerosos consideraría NestJS por su estructura y convenciones.

**Arquitectura por capas**: Se separó la aplicación en Route / Controller / Service / Repository / Prisma. Los controllers reciben y validan las peticiones HTTP, los services contienen la lógica de negocio y los repositories encapsulan el acceso a datos. Esta separación facilita el mantenimiento, las pruebas y la evolución del proyecto.

**Prisma con PostgreSQL (Neon)**: Neon ofrece PostgreSQL serverless con una capa gratuita suficiente para este tipo de proyecto. Prisma genera tipos a partir del schema y mejora la experiencia de desarrollo al reducir errores relacionados con consultas y tipado.

**Zod para validación**: Valida los datos de entrada antes de que lleguen a la lógica de negocio. Si el payload no cumple el schema definido, la API responde con un error 400 descriptivo.

**Singleton de PrismaClient**: Durante el desarrollo, herramientas como ts-node pueden recargar módulos varias veces. Mantener una única instancia de PrismaClient evita crear conexiones innecesarias y reduce el riesgo de agotar el pool de conexiones.

---

## Decisiones de seguridad

**Lo que se implementó:**

- **bcrypt con 12 salt rounds**: Se configuró un costo de 12 rondas para equilibrar seguridad y rendimiento durante el proceso de autenticación.
- **Mensajes genéricos en login**: Siempre devuelve "Credenciales inválidas", nunca dice si el email existe o no. Un atacante no puede enumerar usuarios.
- **Timing attack mitigation**: Aunque el usuario no exista, el sistema igual ejecuta `bcrypt.compare` contra un hash falso y añade un delay mínimo de 300ms. Esto evita que un atacante infiera si un email está registrado midiendo tiempos de respuesta.
- **Rate limiting en auth**: 10 intentos por IP cada 15 minutos en los endpoints de login y registro. Después del límite, devuelve 429. Esto se implementó con la ayuda de la librería express-rate-limit, con el método rateLimit.
- **Rate limiting global**: 200 requests por IP cada 15 minutos en toda la API.
- **Helmet**: Configura headers HTTP de seguridad automáticamente (X-Frame-Options, X-Content-Type-Options, etc.).
- **CORS restringido**: Solo acepta requests del origen configurado en `ALLOWED_ORIGINS`. En producción apunta únicamente al frontend en Vercel.
- **Payload limit**: requests con body mayor a 100kb son rechazados automáticamente.
- **JWT con expiración**: los tokens expiran en 8 horas. Configurable por variable de entorno.
- **Autorización por rol y por sede**: el middleware `authorize` verifica el rol. La lógica de sede se aplica en el service: si el usuario es OPERADOR, su `sedeId` se toma del token, no del body. No puede manipularlo.
- **Soft delete**: los estudiantes no se eliminan físicamente. Se marca `deletedAt` y se excluyen de todas las queries con `where: { deletedAt: null }`.
- **Password nunca se devuelve**: en ninguna respuesta de la API aparece el hash de la contraseña.

**Lo que conozco y no implementé por tiempo:**

- **Refresh tokens**: El flujo actual usa solo access token. Con más tiempo implementaría refresh tokens con rotación, almacenados en cookies httpOnly para evitar acceso desde JavaScript.
- **Cookies httpOnly**: Actualmente el token se guarda en localStorage en el frontend. Es funcional pero vulnerable a XSS. La alternativa correcta es httpOnly cookie, que el navegador no expone a JavaScript.
- **Bloqueo por intentos a nivel de cuenta** — el schema de User ya tiene los campos `loginAttempts` y `blockedUntil` preparados. No alcancé a implementar la lógica que los actualiza en cada intento fallido.
- **Refresh de sesión automático** — si el token expira mientras el usuario está activo, la app lo redirige al login sin previo aviso. Con refresh tokens esto se resolvería transparentemente.

---

## Qué haría diferente con más tiempo

- Implementar refresh tokens con cookies httpOnly — es el cambio de seguridad más importante que quedó fuera.
- Agregar tests de integración para los endpoints de auth y estudiantes. Son los más críticos y los que más valor dan.
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
