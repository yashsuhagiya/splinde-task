.PHONY: help build-dev build-prod dev prod stop clean logs

help:
	@echo "Available commands:"
	@echo "  make dev        - Start development server with hot reloading"
	@echo "  make prod       - Start production server"
	@echo "  make build-dev  - Build development image"
	@echo "  make build-prod - Build production image"
	@echo "  make stop       - Stop all containers"
	@echo "  make clean      - Remove all containers and images"
	@echo "  make logs       - Show container logs"

dev:
	docker-compose --profile dev up --build

build-dev:
	docker-compose --profile dev build

prod:
	docker-compose --profile prod up --build -d

build-prod:
	docker-compose --profile prod build

stop:
	docker-compose down

clean:
	docker-compose down --rmi all --volumes --remove-orphans
	docker system prune -f

logs:
	docker-compose logs -f

start-dev: build-dev dev
start-prod: build-prod prod
