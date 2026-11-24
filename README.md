# TRAVELY

Повний застосунок для пошуку туристичних локацій: React + TypeScript, Django REST Framework і PostgreSQL в одному репозиторії.

## Запуск

Потрібен Docker Desktop. За бажанням створіть локальний `.env` із прикладу, щоб задати власний пароль БД і Django secret key:

```bash
Copy-Item .env.example .env
docker compose up --build -d
```

Після першого запуску:

- фронтенд: <http://localhost:5173>
- Django API: <http://localhost:8000/api/locations/>
- Swagger: <http://localhost:8000/swagger/>

Фронтенд бере локації з публічного бекенду `https://nav-backend-eight.vercel.app` через Vite-проксі. JWT-вхід і реєстрація працюють через локальний Django: на публічному бекенді JWT-маршрути зараз повертають 404. `LOCATIONS_API_TARGET` у кореневому `.env` дозволяє змінити джерело локацій, наприклад на `http://backend:8000`.

Контейнер бекенду автоматично дочекається PostgreSQL і виконає міграції. Дані PostgreSQL зберігаються у Docker volume `postgres_data`; звичайний `docker compose down` їх не видаляє.

## JWT авторизація

- `POST /api/register/` — створити користувача (`username`, `password`)
- `POST /api/token/` — отримати `access` і `refresh`
- `POST /api/token/refresh/` — оновити access-токен
- `POST /api/token/blacklist/` — відкликати refresh-токен під час виходу

Access-токен живе 15 хвилин, refresh-токен — 7 днів. Записи та зміни локацій потребують заголовка `Authorization: Bearer <access>`; перегляд локацій відкритий. Токени у фронтенді зберігаються в `sessionStorage` і очищаються після закриття вкладки.

## Перегляд на телефоні

Коли телефон і комп'ютер у тій самій Wi-Fi мережі, відкрийте на телефоні `http://<локальна-ip-адреса-комп'ютера>:5173`. Vite слухає всі мережеві інтерфейси, а `/api/*` проксирується до обраного бекенду.

`backend/` містить Django-застосунок та міграції. Локальну базу SQLite, секрети й облікові записи з початкового окремого репозиторію в Travely не переносили.
