.PHONY: install run test lint fmt typecheck ci clean frontend frontend-install frontend-build api seed kill-ports start help

PACKAGE_NAME := quini_fantasy

.DEFAULT_GOAL := help

# Show help by default
help:
	@echo ""
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "  Quini Fantasy - Comandos disponibles"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo ""
	@echo "🚀 Iniciar aplicación:"
	@echo "  make start              Iniciar backend + frontend"
	@echo ""
	@echo "📦 Instalación:"
	@echo "  make install            Instalar dependencias Python"
	@echo "  make frontend-install   Instalar dependencias frontend"
	@echo ""
	@echo "🗄️  Base de datos:"
	@echo "  make refresh-weekly     ✅ RECOMENDADO - Actualizar jugadores y crear jornada"
	@echo "                          (Preserva usuarios, predicciones, historial)"
	@echo ""
	@echo "  make setup-db           ⚠️  PELIGRO - Reset completo (BORRA TODO)"
	@echo "                          (Solo primera vez o desarrollo)"
	@echo ""
	@echo "🔧 Desarrollo:"
	@echo "  make api                Iniciar solo backend"
	@echo "  make frontend           Iniciar solo frontend"
	@echo "  make lint               Ejecutar linter"
	@echo "  make fmt                Formatear código"
	@echo "  make test               Ejecutar tests"
	@echo ""
	@echo "📖 Documentación:"
	@echo "  cat DATABASE.md         Ver guía completa de base de datos"
	@echo "  cat README.md           Ver README completo"
	@echo ""
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo ""

install:
	uv sync

run:
	uv run python -m $(PACKAGE_NAME)

test:
	uv run pytest

lint:
	uv run ruff check src tests

fmt:
	uv run ruff format src tests
	uv run ruff check --fix src tests

typecheck:
	uv run mypy src

ci: lint typecheck test

clean:
	rm -rf .venv .pytest_cache .mypy_cache .ruff_cache dist build *.egg-info
	find . -type d -name __pycache__ -exec rm -rf {} +

# Reset database (delete and recreate)
reset-db:
	@echo "Resetting database..."
	@rm -f data/quini_fantasy.db
	@echo "Database deleted"

# API backend
api:
	uv run uvicorn quini_fantasy.main:app --reload --host 0.0.0.0 --port 8000

# Load players from CSV files
load-players:
	uv run python -m quini_fantasy.load_players

# Complete setup: reset database, load players, seed round (⚠️ DELETES ALL DATA)
setup-db:
	@echo ""
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "⚠️  ⚠️  ⚠️   PELIGRO: ESTE COMANDO BORRA TODO   ⚠️  ⚠️  ⚠️"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo ""
	@echo "Este comando va a ELIMINAR PERMANENTEMENTE:"
	@echo "  ✗ TODOS los usuarios y contraseñas"
	@echo "  ✗ TODAS las predicciones enviadas"
	@echo "  ✗ TODO el historial de jornadas"
	@echo "  ✗ TODA la base de datos completa"
	@echo ""
	@echo "Solo deberías usar este comando si:"
	@echo "  • Es la primera vez que configuras el proyecto"
	@echo "  • Quieres empezar desde cero (testing/desarrollo)"
	@echo ""
	@echo "Para actualizar jugadores SIN perder datos usa:"
	@echo "  make refresh-weekly"
	@echo ""
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@read -p "¿Estás SEGURO de que quieres BORRAR TODO? Escribe 'SI BORRAR TODO' para continuar: " confirm; \
	if [ "$$confirm" != "SI BORRAR TODO" ]; then \
		echo ""; \
		echo "❌ Cancelado. No se ha borrado nada."; \
		echo "   Usa 'make refresh-weekly' para actualizar sin borrar datos."; \
		echo ""; \
		exit 1; \
	fi
	@echo ""
	@echo "Borrando base de datos..."
	@rm -f data/quini_fantasy.db
	@echo "✓ Base de datos eliminada"
	@echo ""
	@echo "Cargando jugadores desde CSV..."
	@uv run python -m quini_fantasy.load_players
	@echo ""
	@echo "Creando jornada inicial..."
	@uv run python -m quini_fantasy.seed
	@echo ""
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "✓ Setup completo"
	@echo ""
	@echo "⚠️  RECUERDA: Todos los usuarios han sido eliminados."
	@echo "   Necesitas crear tu cuenta de nuevo en: http://localhost:5173"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo ""

# Refresh weekly data: load new players and create new round (preserves users & predictions)
refresh-weekly:
	@echo ""
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "✅  Actualización Semanal Segura"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo ""
	@echo "Este comando es SEGURO y preserva:"
	@echo "  ✓ Usuarios y contraseñas"
	@echo "  ✓ Predicciones enviadas"
	@echo "  ✓ Historial de jornadas"
	@echo ""
	@echo "Solo actualiza:"
	@echo "  • Estadísticas de jugadores (desde CSVs)"
	@echo "  • Crea nueva jornada con enfrentamientos aleatorios"
	@echo ""
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo ""
	@echo "Actualizando estadísticas de jugadores desde CSVs..."
	@uv run python -m quini_fantasy.load_players
	@echo ""
	@echo "Creando nueva jornada con enfrentamientos aleatorios..."
	@uv run python -m quini_fantasy.seed
	@echo ""
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "✓ Actualización semanal completada"
	@echo ""
	@echo "✓ Usuarios preservados"
	@echo "✓ Predicciones preservadas"
	@echo "✓ Historial preservado"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo ""

# First time setup with sample user (for development)
setup-dev: reset-db
	@echo "Setting up development database..."
	@uv run python -m quini_fantasy.load_players
	@uv run python -m quini_fantasy.seed
	@echo ""
	@echo "✓ Development setup complete"
	@echo "  Create your user account at: http://localhost:5173"

# Frontend commands
frontend-install:
	cd frontend && npm install

frontend:
	cd frontend && npm run dev

frontend-build:
	cd frontend && npm run build

# Kill processes on ports 8000 and 5173
kill-ports:
	@-lsof -ti:8000 | xargs kill -9 2>/dev/null || true
	@-lsof -ti:5173 | xargs kill -9 2>/dev/null || true
	@echo "Ports 8000 and 5173 cleared"

# Run both backend and frontend
start: kill-ports
	@echo "Starting Quini Fantasy..."
	@echo "  Backend:  http://localhost:8000"
	@echo "  Frontend: http://localhost:5173"
	@echo ""
	@trap 'kill 0' EXIT; \
	uv run uvicorn quini_fantasy.main:app --reload --host 0.0.0.0 --port 8000 & \
	cd frontend && npm run dev & \
	wait
