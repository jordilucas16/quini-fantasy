# Quini Fantasy - Frontend

Una aplicacion de quiniela fantasy donde los usuarios predicen que jugador conseguira mas puntos en cada enfrentamiento.

## Tecnologias

- **React 19** - Biblioteca UI
- **TypeScript** - Tipado estatico
- **Vite** - Build tool ultrarapido
- **Tailwind CSS 4** - Estilos utility-first
- **Framer Motion** - Animaciones fluidas
- **Lucide React** - Iconos modernos

## Inicio Rapido

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para produccion
npm run build

# Preview del build
npm run preview
```

## Estructura del Proyecto

```
src/
├── components/
│   ├── layout/          # Header, Footer, AnimatedBackground
│   ├── matchup/         # PlayerCard, MatchupRow, StatusBar
│   └── ui/              # Button, Card, Badge, Progress, Avatar
├── hooks/
│   └── useMatchups.ts   # Estado de las predicciones
├── types/
│   └── index.ts         # Tipos TypeScript
├── data/
│   └── mockData.ts      # Datos de ejemplo
├── utils/
│   └── formatters.ts    # Funciones de formateo
├── App.tsx              # Componente raiz
├── main.tsx             # Punto de entrada
└── index.css            # Estilos globales y tema
```

## Caracteristicas

- **Mobile-first** - Disenado primero para moviles
- **Accesible** - Soporte para lectores de pantalla y navegacion por teclado
- **Animaciones suaves** - Feedback visual en todas las interacciones
- **Modo oscuro** - Tema oscuro por defecto con gradientes vibrantes
- **Responsive** - Adaptado a todos los tamanos de pantalla

## Componentes Principales

### MatchupRow
Cada enfrentamiento muestra dos jugadores con sus estadisticas. El usuario selecciona quien cree que ganara mas puntos.

### PlayerCard
Tarjeta interactiva con:
- Avatar del jugador
- Posicion (badge con color)
- Media de puntos
- Forma reciente (ultimos 5 partidos)
- Grafico sparkline de rendimiento

### StatusBar
Barra inferior flotante que muestra:
- Progreso de seleccion
- Tiempo restante
- Botones de accion

## Proximos Pasos

- [ ] Integracion con API backend
- [ ] Autenticacion de usuarios
- [ ] Historial de predicciones
- [ ] Tabla de clasificacion
- [ ] Notificaciones push
