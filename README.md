# Telas Trejo

Punto de venta y logística para un mayorista de telas por rollo, con almacén en Mérida. Proyecto final de Diseño y Desarrollo Front-End (2026).

- **Frontend:** Angular + Tailwind → se publica en Vercel
- **Backend:** Django REST Framework + Channels (WebSockets) → se publica en Render
- **Base de datos:** PostgreSQL en Neon (en tu computadora se usa SQLite)
- **Entrega:** jueves 3 de diciembre de 2026

## Equipo

| GitHub | Rol |
|---|---|
| [ElZapata12](https://github.com/ElZapata12) | Backend Django, ApiService y coordinación |
| [Undertaker777](https://github.com/Undertaker777) | Estructura Angular, almacenamiento e interfaz |
| [Garcia60d](https://github.com/Garcia60d) | WebSockets, geolocalización y gráficas |

---

# Guía para empezar a trabajar

Síguela en orden. La parte 1 se hace **una sola vez**; la parte 2 se repite **con cada issue**.

## Parte 1 · Preparar tu computadora (una sola vez)

### 1. Instala los programas

| Programa | Cómo comprobar que ya lo tienes |
|---|---|
| Git | `git --version` |
| Node.js LTS (trae npm) | `node -v` y `npm -v` |
| Angular CLI | `npm install -g @angular/cli` y luego `ng version` |
| Python 3.12 o 3.13 | `python --version` (en Windows también `py --version`; al instalar marca **Add Python to PATH**) |
| VS Code | — |

> En Windows usa **Git Bash** para todos los comandos de esta guía.

### 2. Acepta la invitación al repositorio

Revisa tu correo o entra a <https://github.com/ElZapata12/telas-trejo/invitations> y acepta. Sin esto no podrás subir tus ramas.

### 3. Configura tu identidad de Git

Cada integrante debe tener **commits propios**. GitHub reconoce tus commits por el correo, así que usa **el mismo correo de tu cuenta de GitHub**:

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "el-correo-de-tu-cuenta-de-github"
```

Compruébalo en GitHub → Settings → Emails.

### 4. Clona el repositorio

Deja el repositorio y la carpeta del vault del equipo **lado a lado**, nunca uno dentro del otro:

```
Proyectos/
├── telas-trejo/     ← este repositorio (el código)
└── Telas Trejo/     ← vault del equipo (issues, guías y bitácora)
```

```bash
cd Proyectos
git clone https://github.com/ElZapata12/telas-trejo.git
cd telas-trejo
git switch develop
```

`develop` es la rama predeterminada: ahí se junta el trabajo de los tres.

### 5. Instala el hook de commits del equipo

El hook revisa que cada commit salga con **tu** identidad y que en GitHub solo aparezcan los integrantes. Desde la carpeta `telas-trejo`:

```bash
cp "../Telas Trejo/Scripts/git-hooks/commit-msg" .git/hooks/commit-msg
chmod +x .git/hooks/commit-msg
```

Si tu vault está en otra carpeta, cambia la ruta `../Telas Trejo`.

### 6. Sube una rama de prueba

Así comprobamos que tienes permisos (lo pide el issue #1):

```bash
git switch -c prueba/TU-USUARIO
git push -u origin prueba/TU-USUARIO
```

Si aparece en GitHub → Branches, ya quedó. No la borres.

---

## Parte 2 · Trabajar un issue (cada vez)

### 1. Elige tu issue

En GitHub → **Issues**, filtra por **Assignee: tú** y por el milestone actual (M1, M2…). Abre el issue y revisa:

- **Depende de:** si un issue del que dependes no está cerrado, todavía no lo empieces (avisa en el grupo y adelanta otro).
- **Rama:** el nombre de rama que te toca, por ejemplo `feature/14-inventario`.
- **Hecho cuando:** la lista con la que se revisará tu Pull Request.

### 2. Crea tu rama desde `develop` actualizado

```bash
git switch develop
git pull
git switch -c feature/14-inventario
```

Siempre parte de `develop` **recién actualizado**; así evitas conflictos.

### 3. Trabaja con commits pequeños

Haz un commit cada vez que algo funcione. Agrega solo los archivos de tu issue (evita `git add .` si tocaste cosas de más):

```bash
git status
git add frontend/src/app/pages/inventario/
git commit -m "feat: tabla de telas del inventario (#14)"
```

El `(#14)` liga el commit con el issue en GitHub.

| Prefijo | Para qué | Ejemplo |
|---|---|---|
| `feat:` | Algo nuevo | `feat: login con cookie (#13)` |
| `fix:` | Corregir un error | `fix: el carrito no se borraba al vender (#18)` |
| `style:` | Solo estilos | `style: menú responsive en celular (#32)` |
| `docs:` | README o comentarios | `docs: cómo correr el backend (#3)` |
| `chore:` | Configuración | `chore: vercel.json para rutas (#8)` |

Antes de subir, revisa que el commit sea tuyo:

```bash
git log -1 --format="%an <%ae> | %cn <%ce>%n%B"
```

Debe salir tu nombre y tu correo.

### 4. Sube tu rama

```bash
git push -u origin feature/14-inventario
```

Las siguientes veces basta con `git push`.

### 5. Abre el Pull Request hacia `develop`

En GitHub aparecerá el botón **Compare & pull request**:

- **base:** `develop` ← **compare:** tu rama (nunca hacia `main`).
- **Título:** el del issue.
- **Descripción:** `Closes #14`, qué hiciste y cómo probarlo.
- **Reviewers:** pide revisión a un compañero.

### 6. Revisión (máximo medio día)

Quien revisa baja la rama y la prueba:

```bash
git fetch
git switch feature/14-inventario
```

Checklist del revisor:

- [ ] Funciona en mi computadora.
- [ ] Cumple el "Hecho cuando" del issue.
- [ ] No hay secretos, `.env`, ni `console.log` o `print` de prueba.
- [ ] Solo toca los archivos del issue.
- [ ] El autor puede explicar lo que hizo.

### 7. Merge

- Usa **Create a merge commit** (no "Squash" ni "Rebase").
- **No borres la rama** después del merge: es evidencia del trabajo de cada quien.
- El issue se cierra solo gracias a `Closes #14`.

### 8. Vuelve a empezar

```bash
git switch develop
git pull
```

Y regresa al paso 1 con tu siguiente issue.

---

## Ramas del proyecto

| Rama | Para qué | ¿Se puede hacer push directo? |
|---|---|---|
| `main` | Lo que está publicado en Vercel y Render | No, solo por Pull Request (releases) |
| `develop` | Donde se junta el trabajo del equipo | No, solo por Pull Request |
| `feature/NN-nombre` | Una rama por issue | Sí, cada quien en la suya |

Al cerrar cada milestone, ElZapata12 abre un Pull Request `develop` → `main` (Release M1, Release M2, Release final) y Render y Vercel publican solos.

## Quién es dueño de cada archivo

Para no pisarnos, cada quien edita **sus** archivos. Si necesitas tocar uno ajeno, avísale a su dueño y haz el cambio mínimo.

| Archivo o carpeta | Dueño |
|---|---|
| `frontend/src/app/app.routes.ts`, `app.config.ts`, `layout/`, `core/auth.*`, `core/storage.service.ts` | Undertaker777 |
| `shared/ticket/`, `shared/estados.ts`, `pages/login`, `punto-venta`, `recibos`, `configuracion`, `recuperar-ticket` | Undertaker777 |
| `frontend/src/app/core/api.service.ts`, `modelos.ts` y servicios de la API, `pages/pedidos`, `pages/clientes` | ElZapata12 |
| `core/websocket.service.ts`, `core/geolocalizacion.service.ts`, `shared/indicador-conexion/`, `shared/avisos/`, `shared/coordenadas.ts` | Garcia60d |
| `pages/inventario`, `rastreo`, `resumen`, `finanzas` | Garcia60d |
| `backend/config/settings.py` (menos Channels), `urls.py`, `tienda/models.py`, `serializers.py`, `views.py`, `admin.py`, `fixtures/` | ElZapata12 |
| `backend/config/asgi.py`, bloque de Channels en `settings.py`, `tienda/consumers.py`, `routing.py`, `notificaciones.py` | Garcia60d |

Cambios pequeños ya acordados en archivos ajenos: `provideHttpClient()` (#10) y `provideCharts()` (#31) en `app.config.ts`, y las llamadas a `notificar()` en `views.py` (#20).

---

## Correr el proyecto en tu computadora

> Las carpetas `frontend/` y `backend/` se crean en los issues #2 y #3. Hasta que se fusionen en `develop`, esta parte todavía no aplica.

### Backend (Django)

Desde `telas-trejo/backend`:

```bash
python -m venv .venv

# Windows (Git Bash):
source .venv/Scripts/activate
# macOS / Linux:
source .venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py loaddata demo        # cuando exista el fixture (#17)
python manage.py createsuperuser      # tu usuario local para entrar a la app
python manage.py runserver
```

- En tu computadora se usa SQLite: no necesitas la base de Neon.
- Cada vez que hagas `git pull` y cambien los modelos, vuelve a correr `python manage.py migrate`.
- Si alguien agrega un paquete, vuelve a correr `pip install -r requirements.txt`.

### Frontend (Angular)

Desde `telas-trejo/frontend`:

```bash
npm install
ng serve
```

Abre <http://localhost:4200>. Necesitas el backend corriendo para ver datos.

- Si alguien agrega un paquete (cambia `package.json`), vuelve a correr `npm install`.

---

## Si hay un conflicto

1. En tu rama, trae lo último de `develop`: `git pull origin develop`.
2. VS Code marca los conflictos: elige qué se queda y borra las marcas `<<<<<<<`, `=======` y `>>>>>>>`.
3. Prueba que todo funcione y luego `git add .`, `git commit` y `git push`.
4. Si no entiendes el conflicto, pide ayuda en el grupo antes de borrar código ajeno.

## Problemas comunes

| Mensaje o problema | Qué pasa | Solución |
|---|---|---|
| `Permission denied` o `403` al hacer push | No aceptaste la invitación | Acepta la invitación (Parte 1, paso 2) |
| `protected branch` al hacer push | Intentaste subir directo a `develop` o `main` | Crea tu rama `feature/...` y abre un Pull Request |
| `Commit bloqueado` | El hook encontró una identidad o mensaje que no es del equipo | Lee el mensaje del hook, corrige tu identidad o tu mensaje y repite el commit |
| `hint: Updates were rejected` | Tu rama local está atrasada | `git pull` y luego `git push` |
| Mis commits no salen con mi foto en GitHub | El correo de Git no es el de tu cuenta | Revisa la Parte 1, paso 3 |
| Empecé a trabajar en `develop` por error | Aún no hiciste commit | `git switch -c feature/NN-nombre` (tus cambios se van contigo a la rama nueva) |

## Reglas rápidas

- Una rama por issue, siempre desde `develop` actualizado.
- Nunca subas `.env`, `node_modules`, `.venv` ni `db.sqlite3` (ya están en `.gitignore`).
- Todo entra a `develop` por Pull Request con revisión de un compañero.
- Merge commit y no borrar ramas.
- Cada quien debe poder explicar su código.
- Diario (5 minutos): ¿qué terminé?, ¿qué sigue?, ¿qué me bloquea?

## Enlaces

- Repositorio: <https://github.com/ElZapata12/telas-trejo>
- Issues: <https://github.com/ElZapata12/telas-trejo/issues>
- Milestones: <https://github.com/ElZapata12/telas-trejo/milestones>
- App en Vercel: _pendiente (#8)_
- API en Render: _pendiente (#7)_
