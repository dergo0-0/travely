# Travely frontend

Застосунок React + TypeScript + Vite. Бекенд знаходиться в [alka-Ukraine/python](https://github.com/alka-Ukraine/python).

```bash
npm ci
npm run dev
```

Локальний Vite проксирує `/api` й `/media` до `http://127.0.0.1:8000`. Усі API-запити, включно з локаціями, JWT, постами та фото, йдуть на один бекенд. Іншу локальну адресу задайте через `API_PROXY_TARGET` у `.env`.

Для production-збірки: `npm run build`. Перед нею задайте `VITE_API_BASE_URL=https://ваш-бекенд/api`; статичний хостинг не запускає Vite-проксі. Домен фронтенду має бути дозволений у CORS бекенду.
