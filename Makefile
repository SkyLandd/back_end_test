.PHONY: build up down logs init

init:
	cp -n .env.example .env || echo ".env already exists"

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

# Run everything with a single command
run: init build up logs
