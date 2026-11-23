.DEFAULT_GOAL := up

.PHONY: up down logs shell migrate

up:
	docker compose up --build -d

down:
	docker compose down

logs:
	docker compose logs -f

shell:
	docker compose exec backend python manage.py shell

migrate:
	docker compose exec backend python manage.py migrate
