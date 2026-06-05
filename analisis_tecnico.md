# Análisis Técnico — Diagnóstico de Carga Lenta

**Caso:** El módulo de agendamientos del día tarda entre 6 y 10 segundos en cargar. Los asesores de admisiones se quejan. Me llega el ticket.

Lo primero que hago antes de tocar una sola línea de código es entender qué está pasando realmente. Asumir que es "la base de datos" o "el frontend" sin datos es perder el tiempo. Haría lo siguiente:

---

## Paso 1 — Reproducir el problema y recopilar contexto

obtengo información básica:

- ¿El problema ocurre siempre o solo a ciertas horas? (pico de usuarios o en carga normal)
- ¿Solo en producción o también en staging o local?
- ¿Todos los usuarios lo experimentan o solo algunos? (puede ser por rol, por sede, por volumen de datos)
- ¿Empezó de repente o fue gradual? (un deploy reciente, crecimiento de datos, cambio de infra)

Con esto ya puedo descartar gran parte de las posbiles causas. Si solo pasa a las 8am cuando todos entran, probablemente es concurrencia. Si empezó después de un deploy, probablemente es código. Si solo le pasa a una sede, probablemente es volumen de datos.

---

## Paso 2 — Medir tiempos reales en el navegador

Abro DevTools, luego la pestaña Network, recargo la página y miro:

- ¿Cuánto tarda la request al backend? (el número que me importa primero)
- ¿Cuánto tarda el navegador en renderizar después de recibir la respuesta?
- ¿Hay muchas requests o una sola que tarda?

Si la request al backend responde en 200ms pero la página tarda 8 segundos en mostrarse, el problema está en el frontend. Probablemente está renderizando una lista enorme sin virtualización, sin paginación o haciendo cálculos pesados en el hilo principal.

Si la request tarda 7 segundos, el problema está en el backend o la base de datos. descartando el front

---

## Paso 3 — Medir el tiempo de respuesta del backend por tramos

Con el problema ubicado en el backend, necesito saber en qué parte del flujo se pierde el tiempo. Realizo una revisión de los logs del servidor buscando el tiempo total de la request. Si no hay logs suficientemente detallados, agrego timestamps manuales temporales en el controller y el service para medir cuánto tarda cada etapa:

```
[controller] inicio: 0ms
[service] antes de query: 12ms
[repository] query ejecutada: 6843ms  ← acá está el problema
[controller] respuesta enviada: 6851ms
```

Esto me dice si el tiempo se va en la query, en el procesamiento de datos en JavaScript, o en otra cosa como llamadas a servicios externos.

---

## Paso 4 — Analizar las queries en la base de datos

Si el tiempo se va en la query, voy directo a la base de datos. Las herramientas que uso:

- **EXPLAIN ANALYZE** en PostgreSQL: me muestra el plan de ejecución de la query, cuántas filas escanea, si usa índices o hace sequential scan, y el tiempo real de cada operación.
- **pg_stat_statements**: Es una extensión de Postgres que registra las queries más lentas históricamente. Útil para ver si el problema es recurrente.
- **Logs de queries lentas**: en Prisma se puede activar con `log: ['query']` para ver las queries que genera y sus tiempos.

Eso lo hago con el objetivo de buscar una de las siguientes causas:

- **Sequential scan en tablas grandes**: Significa que falta un índice. Si la query filtra por `sedeId` o `estado` y no hay índice en esas columnas, Postgres lee toda la tabla.
- **Problema N+1**: Si veo 50 queries casi idénticas en los logs cuando debería haber una sola, es N+1. Esto ocurre cuando se itera una lista y dentro del loop se hace otra query por cada elemento. La solución es un JOIN o `include` de Prisma.
- **Joins sin índices**: Un join entre tablas grandes sin índice en la columna de relación puede ser catastrófico.

---

## Paso 5 — Revisar el volumen de datos que se está devolviendo

En este paso procedo a revisar cómo se está devolviendo el volumen de los datos traídos desde la query:

- ¿Se está trayendo toda la tabla y filtrando en JavaScript en vez de en la query?
- ¿Se devuelven campos innecesarios (columnas pesadas, blobs, textos largos)?
- ¿Hay paginación implementada o se devuelven miles de registros de una vez?

Y con base en esto pensaría en realizar una optimización tanto en la query como en la forma y cantidad de los datos que estamos retornando.

---

## Paso 6 — Descartar problemas de infraestructura

Si la query y el código parecen bien, procedo a revisar el estado del servidor:

- **CPU** — si está al 90%+ de forma sostenida, hay un proceso que está consumiendo todo. Puede ser otro módulo, un job programado, o un memory leak.
- **Memoria** — si la memoria está llena, el sistema empieza relantizarse.
- **Disco** — en bases de datos, I/O lento en disco puede hacer que queries normales tarden mucho. Se nota cuando el `EXPLAIN ANALYZE` muestra tiempos altos en operaciones de lectura.
- **Conexiones de base de datos** — si el pool de conexiones está agotado, genera que las requests hagan cola esperando una conexión libre. En Prisma se configura con `connection_limit` en la DATABASE_URL.

Para medir esto uso los dashboards del proveedor (Render, Railway, Neon, Sequel) o herramientas como `htop` si tengo acceso al servidor.

---

## Paso 7 — Revisar si el problema es de red o latencia geográfica

Si todo lo anterior parece bien, considero la red:

- ¿El servidor de backend y la base de datos están en la misma región? ya que Una query que viaja de São Paulo a us-east-1 u otra región, agrega 100-200ms por round trip, y si hay múltiples queries (N+1), se multiplica.
- ¿El frontend está haciendo múltiples requests en secuencia cuando podrían ir en paralelo? Un `await` dentro de un loop es el error más común acá.
- ¿Hay algún middleware o proxy intermedio que esté agregando latencia?

Con herramientas como Postman se puede medir el tiempo de conexión, DNS lookup y transferencia por separado, lo que ayuda a aislar si es latencia de red o tiempo de procesamiento.

---

## Paso 8 — Conclusión del diagnóstico

Al final de este proceso tengo datos concretos, no suposiciones. Sé exactamente en qué tramo se va el tiempo y puedo proponer una solución específica: agregar un índice, corregir un N+1, implementar paginación, o escalar la instancia.

Por último, luego de implementar la solución ante este problema, documento la solución y comparto los hallazgos con el equipo para futuras incidencias y mejorar nuestro tiempo de reacción y respuesta.