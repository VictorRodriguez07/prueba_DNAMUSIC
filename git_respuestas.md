# Sección 7: Git y Control de Versiones

## 1. Comando para crear una rama llamada `feature/filtro-por-sede` desde `main`

```bash
git checkout main
git pull origin main
git checkout -b feature/filtro-por-sede
```

**Explicación:**
Primero me debo asegurar de estar en la rama `main` y tener la versión más reciente del repositorio, por medio de git checkout main y actualizo mi rama con git pull origin main. Luego creo y cambio a la nueva rama `feature/filtro-por-sede`, haciendo uso del comando git checkout -b .

---

## 2. Comando para hacer commit con un mensaje descriptivo siguiendo Conventional Commits

```bash
git add .
git commit -m "feat: agregar filtro de usuarios por sede"
```

**Explicación:**
Se agregan los cambios al área de preparación y se realiza un commit utilizando el estándar Conventional Commits. El prefijo `feat:` indica una nueva funcionalidad. dependiendo de lo que se agregue, se debe usar el prefijo correcto.

---

## 3. Comando para subir esa rama al remoto

```bash
git push -u origin feature/filtro-por-sede
```

**Explicación:**
Este comando sube la rama local al repositorio remoto y establece la relación de seguimiento para futuros `push` y `pull`.

---

## 4. Proceso para crear un Pull Request y qué incluir en la descripción

### Proceso

1. Subir la rama al repositorio remoto usando el comando git push -u origin <nombre-de-la-rama>.
2. Ingresar a GitHub.
3. Seleccionar la opción "Compare & Pull Request".
4. Verificar que la rama destino sea `main`.
5. Completar el título y la descripción.
6. Solicitar revisión si aplica.
7. Crear el Pull Request.

### Información que incluiría

* Resumen de los cambios realizados.
* Objetivo de la funcionalidad.
* Archivos o módulos afectados.
* Evidencias o capturas de pantalla (si aplica).
* Pasos para probar la funcionalidad.
* Consideraciones técnicas importantes.

**Ejemplo:**

```text
## Descripción
Se implementa el filtro de usuarios por sede dentro del módulo de gestión de usuarios.

## Cambios realizados
- Se agrega selector de sede.
- Se implementa filtrado en frontend.
- Se ajusta consulta al backend.

## Cómo probar
1. Ingresar al módulo de usuarios.
2. Seleccionar una sede.
3. Verificar que se muestren únicamente los usuarios asociados.

## Evidencia
Adjunta captura de pantalla o GIF.
```

---

## 5. ¿Qué harías si al hacer pull de main hay conflictos con tu rama?

### Proceso paso a paso

1. Cambiar a mi rama de trabajo, y verificar que no tenga cambios pendientes con git status.

```bash
git status
git checkout feature/filtro-por-sede
git status
```

2. Obtener los últimos cambios del repositorio:

```bash
git fetch origin
```

3. Actualizar mi rama con los cambios de `main`:

```bash
git merge origin/main
```

4. Resolver manualmente los conflictos en los archivos afectados.


5. Verificar los cambios:

```bash
git status
```

6. Marcar los conflictos como resueltos:

```bash
git add .
```

7. Crear el commit de resolución:

```bash
git commit -m "fix: resolver conflictos con main"
```

8. Subir los cambios actualizados:

```bash
git push origin feature/filtro-por-sede
```

**Explicación:**
Cuando existen conflictos, reviso cada archivo afectado, decido qué cambios conservar y cuales descartar, realizo pruebas para validar el comportamiento esperado en un entorno de desarrollo y finalmente subo la versión corregida al repositorio remoto.

---

## Historial de commits

En cuánto al historial de commits, Mantendría un historial organizado con commits pequeños y descriptivos, por ejemplo:

```text
feat: crear tabla de usuarios
feat: implementar filtro por sede
feat: conectar filtro con API
style: ajustar estilos del formulario
fix: corregir validación de sede
docs: actualizar documentación
```

Esto facilita la revisión de cambios, el seguimiento del desarrollo y la colaboración en equipo.
