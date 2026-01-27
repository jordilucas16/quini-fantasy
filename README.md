# Quini Fantasy

Una aplicación de Fantasy Football al estilo quiniela. Los usuarios predicen qué jugador de dos obtendrá más puntos en 11 enfrentamientos por jornada.

## Setup Inicial

```bash
# 1. Instalar dependencias (backend y frontend)
make install
cd frontend && npm install

# 2. Configurar la base de datos con datos reales
make setup-db

# 3. Iniciar backend y frontend
make start
```

La aplicación estará disponible en:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Docs API: http://localhost:8000/docs

## Base de Datos

### 🚨 IMPORTANTE: Comandos de Base de Datos

#### ✅ Actualización Semanal (RECOMENDADO - Seguro)

```bash
# Actualizar jugadores y crear nueva jornada SIN borrar usuarios
make refresh-weekly
```

**✓ Preserva:** usuarios, predicciones, historial
**Actualiza:** estadísticas de jugadores, crea nueva jornada

**💡 Usa este comando cada semana después de actualizar los CSVs.**

#### ⚠️ Setup Inicial (PELIGRO - Solo primera vez)

```bash
# ⛔ BORRA TODO: usuarios, predicciones, historial
make setup-db
```

**⚠️ Este comando DESTRUYE todos los datos.**
Solo úsalo la primera vez que configuras el proyecto.
Te pedirá confirmación escribiendo "SI BORRAR TODO".

### Comandos Individuales

```bash
# Solo cargar jugadores desde CSVs (borra jugadores existentes)
make load-players

# Solo crear nueva jornada (preserva todo lo demás)
make seed

# Resetear base de datos completa (⚠️ borra TODO)
make reset-db
```

### 📖 Documentación Completa

Ver [DATABASE.md](DATABASE.md) para:
- Explicación detallada de cada comando
- Estructura de la base de datos
- Flujo de trabajo semanal
- Troubleshooting

## Desarrollo

### Backend

```bash
# Format code
make fmt

# Run linter
make lint

# Run type checker
make typecheck

# Run tests
make test

# Run all CI checks
make ci
```

### Frontend

```bash
cd frontend

# Desarrollo
npm run dev

# Build
npm run build

# Type check
npm run typecheck
```

## Estructura del Proyecto

```
quini-fantasy/
├── src/quini_fantasy/       # Backend Python
│   ├── models.py           # Modelos SQLAlchemy
│   ├── api.py              # Endpoints FastAPI
│   ├── auth.py             # Autenticación JWT
│   ├── load_players.py     # Script de carga CSV
│   └── seed.py             # Script de seed
├── frontend/               # Frontend React
│   └── src/
│       ├── components/     # Componentes React
│       ├── contexts/       # Context providers
│       └── services/       # API client
├── data/
│   ├── csv_laliga/        # CSVs con estadísticas
│   └── quini_fantasy.db   # Base de datos SQLite
└── DATABASE.md            # Documentación de la BD
```

## Flujo de Trabajo Semanal

1. **Actualizar estadísticas:**
   - Descargar CSVs actualizados con estadísticas de La Liga
   - Colocarlos en `data/csv_laliga/`

2. **Actualizar base de datos:**
   ```bash
   make refresh-weekly
   ```

3. **Verificar:**
   - Los jugadores se actualizan con nuevas estadísticas
   - Se crea una nueva jornada con enfrentamientos aleatorios
   - El deadline se establece a 3 días después
