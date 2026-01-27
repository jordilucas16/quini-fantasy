# Database Management

Este documento explica cómo gestionar la base de datos de Quini Fantasy.

---

## 🚨 IMPORTANTE: Lee esto primero

Hay **DOS comandos principales**:

### ✅ Para uso normal (actualización semanal):
```bash
make refresh-weekly
```
- **✓ PRESERVA usuarios, predicciones e historial**
- Actualiza estadísticas de jugadores
- Crea nueva jornada

### ⛔ PELIGRO - Solo primera vez:
```bash
make setup-db
```
- **✗ BORRA TODO: usuarios, predicciones, historial**
- Requiere confirmación manual
- Solo úsalo la primera vez

---

## Comandos disponibles

### 🔴 Setup inicial completo - ⚠️ BORRA TODO ⚠️

```bash
make setup-db
```

**⛔️ PELIGRO - ESTE COMANDO DESTRUYE TODOS LOS DATOS ⛔️**

Este comando hace un reset completo de la base de datos:

**❌ ELIMINA PERMANENTEMENTE:**
- ❌ TODOS los usuarios y sus contraseñas
- ❌ TODAS las predicciones enviadas
- ❌ TODO el historial de jornadas anteriores
- ❌ TODA la base de datos completa
- ❌ TODO - No hay forma de recuperar los datos después

**Después ejecuta:**
1. Carga todos los jugadores desde los CSVs
2. Crea una jornada inicial con 11 enfrentamientos aleatorios

**⚠️ El comando te pedirá confirmación escribiendo "SI BORRAR TODO" antes de ejecutarse.**

**🔴 SOLO úsalo cuando:**
- ✓ Es la primera vez que configuras el proyecto
- ✓ Estás en desarrollo/testing y quieres empezar de cero
- ✓ Estás 100% seguro de que quieres perder todos los datos

**Para actualización semanal usa `make refresh-weekly` (ver abajo)**

### Cargar jugadores desde CSVs

```bash
make load-players
```

Carga los jugadores desde los archivos CSV ubicados en `data/csv_laliga/`:
- `standard_stats_20260122.csv` - Estadísticas de todos los jugadores
- `goalkeeping_stats_20260122.csv` - Estadísticas adicionales de porteros

Este comando:
- Elimina todos los jugadores existentes
- Carga nuevos jugadores con sus estadísticas actualizadas
- **NO** elimina usuarios, predicciones ni jornadas

### Crear nueva jornada

```bash
make seed
```

Crea una nueva jornada con 11 enfrentamientos aleatorios usando los jugadores existentes en la base de datos.

**Nota:** Solo se puede tener una jornada activa a la vez. Si ya existe una jornada activa, este comando no hará nada.

### 🟢 Actualización semanal - ✅ SEGURO - RECOMENDADO

```bash
make refresh-weekly
```

**✅ Este es el comando que debes usar cada semana para actualizar los datos.**

**✓ SEGURO - NO borra nada importante:**

Este comando:
1. Actualiza las estadísticas de jugadores desde los CSVs (goles, asistencias, tarjetas, etc.)
2. Crea una nueva jornada con 11 enfrentamientos aleatorios

**✅ PRESERVA (no se pierde nada):**
- ✅ Usuarios y contraseñas
- ✅ Predicciones enviadas
- ✅ Historial completo de jornadas anteriores
- ✅ Toda la información importante

**Solo actualiza/reemplaza:**
- Estadísticas de jugadores (se actualizan con los datos del CSV nuevo)
- Lista de jugadores (se reemplaza con el CSV nuevo)
- Crea una nueva jornada (solo si no hay una activa)

**💡 Usa este comando cada semana después de actualizar los CSVs.**

### Resetear base de datos

```bash
make reset-db
```

Elimina completamente la base de datos. **⚠️ Esto borrará todos los datos.**

## Flujo de trabajo semanal

### 🔄 Proceso recomendado cada semana

1. **Al inicio de cada jornada:**
   - Actualiza los CSVs en `data/csv_laliga/` con las estadísticas más recientes
   - Ejecuta **`make refresh-weekly`** para cargar los nuevos datos y crear la siguiente jornada

   **✅ Seguro:** Este comando NO borra usuarios ni predicciones

2. **Durante la jornada:**
   - Los usuarios envían sus predicciones
   - La jornada se cierra automáticamente cuando se alcanza el deadline

3. **Después de la jornada:**
   - Actualiza los resultados de los enfrentamientos
   - Los usuarios pueden ver sus resultados en la página de historial

### ⛔ NUNCA uses `make setup-db` para actualizaciones semanales

**`make setup-db`** borra TODO (usuarios, predicciones, historial).

**Solo úsalo:**
- ✓ La primera vez que instalas el proyecto
- ✓ En desarrollo cuando quieres resetear todo
- ✗ **NUNCA para actualización semanal en producción**

## Estructura de datos

### Modelo Player

Los jugadores tienen los siguientes campos:

**Campos generales:**
- `name` - Nombre del jugador
- `team` - Equipo (Squad)
- `position` - Posición normalizada (GK, DF, MF, FW)
- `matches_90s` - Partidos jugados (en periodos de 90 minutos)
- `goals` - Goles anotados
- `assists` - Asistencias
- `yellow_cards` - Tarjetas amarillas
- `red_cards` - Tarjetas rojas
- `avg_points` - Puntos promedio calculados

**Campos solo para porteros (GK):**
- `goals_against` - Goles en contra
- `saves` - Paradas
- `clean_sheets` - Porterías a cero
- `penalties_saved` - Penaltis parados

### Cálculo de avg_points

**Jugadores de campo:**
```
avg_points = (goles * 6 + asistencias * 4 - amarillas * 1 - rojas * 3) / partidos_90s
```

**Porteros:**
```
avg_points = (porterias_cero * 4 + penaltis_parados * 5 - goles_contra * 1) / partidos_90s
```

## Normalización de posiciones

Las posiciones en los CSVs se normalizan a 4 categorías:
- `GK` - Porteros
- `DF` - Defensas (DF, CB, RB, LB, RWB, LWB)
- `MF` - Centrocampistas (MF, CM, DM, AM, RM, LM)
- `FW` - Delanteros (FW, ST, CF, LW, RW)

## Troubleshooting

### "No players found in database"

Ejecuta `make load-players` para cargar los jugadores desde los CSVs.

### "Active round already exists"

Ya hay una jornada activa. Espera a que termine o márcala como inactiva manualmente antes de crear una nueva.

### "Not enough players for matchups"

No hay suficientes jugadores con al menos 1 partido jugado (90s >= 1.0). Verifica que los CSVs tengan datos válidos.
