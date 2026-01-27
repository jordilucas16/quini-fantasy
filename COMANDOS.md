# 🚨 GUÍA RÁPIDA DE COMANDOS

## ✅ USO NORMAL (Cada semana)

```bash
make refresh-weekly
```

**Esto es SEGURO.** Úsalo cada semana para:
- ✅ Actualizar estadísticas de jugadores
- ✅ Crear nueva jornada
- ✅ **NO borra usuarios ni predicciones**

---

## ⛔ PELIGRO - Solo primera vez

```bash
make setup-db
```

**🔴 ESTO BORRA TODO:**
- ❌ Usuarios
- ❌ Contraseñas
- ❌ Predicciones
- ❌ Historial
- ❌ TODO

**Solo úsalo:**
- Primera vez que instalas
- Desarrollo/testing cuando quieres resetear

**El comando te pedirá confirmación.**

---

## 🚀 Iniciar aplicación

```bash
make start
```

Inicia backend (API) + frontend

---

## 📋 Resumen visual

```
┌─────────────────────────────────────────────────────┐
│  CADA SEMANA (actualizar datos)                     │
│  ────────────────────────────────────────────────   │
│  $ make refresh-weekly                              │
│                                                      │
│  ✅ SEGURO - No borra nada                          │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  SOLO PRIMERA VEZ (setup inicial)                   │
│  ────────────────────────────────────────────────   │
│  $ make setup-db                                    │
│                                                      │
│  ⛔ PELIGRO - Borra TODO                            │
│  Requiere confirmación: "SI BORRAR TODO"            │
└─────────────────────────────────────────────────────┘
```

---

## ❓ ¿Qué comando uso?

### ✅ Cada semana para actualizar estadísticas
```bash
make refresh-weekly
```

### ⚠️ Solo la primera vez que instalas el proyecto
```bash
make setup-db
```

### 🚀 Para iniciar la aplicación
```bash
make start
```

### 📖 Ver todos los comandos disponibles
```bash
make help
```

---

## 🆘 Ayuda

- **Documentación completa:** `cat DATABASE.md`
- **README:** `cat README.md`
- **Lista de comandos:** `make help`
