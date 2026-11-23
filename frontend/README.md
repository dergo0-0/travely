# Frontend

React, TypeScript і Vite frontend для TRAVELY. Інтерфейс українською.

## Локальний запуск

Потрібен Django API на `http://127.0.0.1:8000`:

```bash
npm install
npm run dev
```

Vite проксирує `/api/*` до Django. Змініть `API_PROXY_TARGET`, якщо бекенд запущений за іншою адресою. У кореневому `docker-compose.yml` цей параметр вказує на контейнер `backend`.

Для production-збірки виконайте `npm run build`; перегляд готової збірки — `npm run preview`.

## API

- `GET /api/locations/?search=...` шукає за назвою, містом, країною та категорією.
- `POST /api/register/` створює обліковий запис.
- `POST /api/token/` видає JWT access/refresh пару.
- `POST /api/token/refresh/` оновлює access-токен; клієнт автоматично повторює запит після 401.
- `POST /api/token/blacklist/` відкликає refresh-токен під час виходу.

Пошук підтримує назву місця, місто й категорію. Фільтри за датою та кількістю мандрівників вимкнені, бо API поки не має таких полів.

## Структура

```text
src/
  app/                         # Складання сторінки та глобальні стилі
  shared/api/                  # API-клієнт, JWT сесія та запити локацій
  shared/ui/                   # Повторно використовувані SVG-компоненти
  features/authentication/     # Вхід, реєстрація та профіль
  features/destination-search/ # Пошук локацій
  features/hero/               # Головний банер
  features/site-footer/        # Нижня частина сторінки
  features/site-header/        # Шапка й навігація
  features/travel-inspiration/ # Блок натхнення
```

Кожна функціональна секція має власний React-компонент і CSS-файл. Зображення секції зберігаються поруч у `assets/`. Спільні SVG-іконки розміщені в `src/shared/ui/`.
