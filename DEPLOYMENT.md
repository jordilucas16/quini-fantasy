# Deployment Guide - Render

Esta guía explica cómo desplegar Quini Fantasy en Render.

## 📋 Pre-requisitos

1. Cuenta en [Render](https://render.com) (gratis)
2. Repositorio Git con el código (GitHub, GitLab, o Bitbucket)
3. Archivos CSV de jugadores en `data/` (para inicialización)

## 🚀 Pasos para el despliegue

### 1. Preparar el repositorio

Asegúrate de que tienes estos archivos en el repo:

```
quini-fantasy/
├── Dockerfile              # ✓ Build configuration
├── docker-entrypoint.sh    # ✓ Startup script
├── render.yaml             # ✓ Render configuration
├── .dockerignore           # ✓ Files to ignore in Docker build
├── data/
│   ├── players_stats.csv   # ⚠️ IMPORTANTE: Datos de jugadores
│   └── team_stats.csv      # Datos de equipos
└── ...
```

**⚠️ IMPORTANTE:** Los archivos CSV deben estar en el repositorio para la inicialización automática.

### 2. Conectar Render con tu repositorio

1. Ve a [Render Dashboard](https://dashboard.render.com/)
2. Click en **"New +"** → **"Blueprint"**
3. Conecta tu repositorio de GitHub/GitLab
4. Render detectará automáticamente el archivo `render.yaml`

### 3. Configurar el servicio

Render leerá la configuración de `render.yaml`:

- **Plan:** Free (750 horas/mes)
- **Región:** Frankfurt (o cambia a Oregon para US)
- **Disco persistente:** 1GB para SQLite
- **Variables de entorno:**
  - `PORT`: 8000
  - `JWT_SECRET_KEY`: Auto-generado (seguro)
  - `RENDER`: "true" (detecta producción)

### 4. Primera deployment

Al hacer el primer deploy:

1. **Build** (5-10 minutos):
   - Construye frontend (React + Vite)
   - Construye backend (Python + FastAPI)
   - Copia archivos estáticos

2. **Inicialización automática** (`docker-entrypoint.sh`):
   ```bash
   ✓ Carga jugadores desde CSV
   ✓ Crea jornada inicial
   ✓ Inicia servidor Uvicorn
   ```

3. **URL de la app:**
   ```
   https://quini-fantasy.onrender.com
   ```

### 5. Verificar el despliegue

Después del deploy, verifica:

```bash
# Health check
curl https://quini-fantasy.onrender.com/health
# Respuesta: {"status":"healthy"}

# Frontend
curl https://quini-fantasy.onrender.com/
# Respuesta: HTML del frontend

# API
curl https://quini-fantasy.onrender.com/api/rounds/active
# Respuesta: Datos de la jornada activa
```

## 🔄 Actualizaciones semanales

### Opción 1: Actualización manual (recomendado para producción)

1. **Actualizar CSVs localmente:**
   ```bash
   # Descargar nuevos datos de La Liga
   # Actualizar data/players_stats.csv y data/team_stats.csv
   ```

2. **Subir a GitHub:**
   ```bash
   git add data/players_stats.csv data/team_stats.csv
   git commit -m "Update player stats for Jornada 23"
   git push
   ```

3. **Ejecutar comando en Render Shell:**

   Ve a Render Dashboard → Tu servicio → **Shell** y ejecuta:
   ```bash
   uv run python -m quini_fantasy.load_players
   uv run python -m quini_fantasy.seed
   ```

### Opción 2: API de actualización (avanzado)

Podrías crear un endpoint protegido `/api/admin/refresh-weekly` que:
- Requiera un token de administrador
- Ejecute `load_players` y `seed`
- Se pueda llamar desde un cron job

## 📊 Base de datos

### SQLite con disco persistente

- **Ubicación:** `/app/data/quini_fantasy.db`
- **Disco:** 1GB persistente (no se borra en redeploys)
- **Backups:** ⚠️ Debes hacerlos manualmente

### Hacer backup de la base de datos

1. Ve a Render Dashboard → Tu servicio → **Shell**
2. Descarga la DB:
   ```bash
   # Ver tamaño
   ls -lh /app/data/quini_fantasy.db

   # Copiar a un sitio accesible (crear endpoint temporal)
   ```

Alternativamente, crea un endpoint de admin para descargar backups.

## 🔐 Seguridad

### Variables de entorno sensibles

Render auto-genera `JWT_SECRET_KEY` - **nunca la expongas**.

### CORS

En producción, `main.py` permite todos los orígenes:
```python
allow_origins=["*"]  # Cuando RENDER=true
```

Para más seguridad, puedes restringir a tu dominio:
```python
allow_origins=["https://quini-fantasy.onrender.com"]
```

## 🐛 Troubleshooting

### El servicio no inicia

1. **Ver logs:**
   Render Dashboard → Tu servicio → **Logs**

2. **Errores comunes:**
   - `players_stats.csv not found`: Asegúrate de que los CSVs están en el repo
   - `Port already in use`: Render asigna el puerto automáticamente
   - `Database locked`: Otro proceso está usando la DB

### La app se duerme (Free tier)

Render Free tier duerme después de 15 minutos de inactividad:
- Primera request después de dormir: ~30 segundos
- Considera usar un uptime monitor (UptimeRobot) para mantenerla despierta

### No se pueden hacer predicciones

1. Verifica que hay una jornada activa:
   ```bash
   curl https://quini-fantasy.onrender.com/api/rounds/active
   ```

2. Si no hay jornada, crea una desde Shell:
   ```bash
   uv run python -m quini_fantasy.seed
   ```

## 📈 Monitoreo

### Métricas incluidas en Render

- CPU usage
- Memory usage
- Request rate
- Response time

### Logs

```bash
# Ver logs en tiempo real
# Dashboard → Logs → Stream
```

## 💰 Costos

### Free Tier (actual)
- ✓ 750 horas/mes
- ✓ 1GB disco persistente
- ✓ HTTPS incluido
- ⚠️ Se duerme tras 15min inactividad

### Paid Tier ($7/mes)
- ✓ Siempre activo
- ✓ Más CPU/RAM
- ✓ Métricas avanzadas

## 🎯 Próximos pasos

1. **Dominio personalizado:** `quini-fantasy.tudominio.com`
2. **PostgreSQL:** Migrar de SQLite para mejor rendimiento
3. **CI/CD:** Tests automáticos antes de deploy
4. **Monitoring:** Sentry para error tracking

---

## 📞 Soporte

- [Render Docs](https://render.com/docs)
- [Community Forum](https://community.render.com)
- GitHub Issues de este proyecto
