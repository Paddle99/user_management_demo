# User Management System

Sistema di gestione utenti demo con backend Laravel (PHP) e frontend React + TypeScript + Vite.

## Requisiti

- Docker 20.10+
- Docker Compose 2.0+

Oppure per sviluppo locale:
- Node.js 20.x+
- PHP 8.2+
- Composer 2.x+
- SQLite 3.x

## Struttura del Progetto

```
user_management/
├── backend/              # API Laravel (PHP)
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── routes/
│   └── Dockerfile
├── frontend/             # Frontend React + TypeScript
│   ├── src/
│   ├── public/
│   └── Dockerfile
└── docker-compose.yml
```

## Configurazione

### Variabili d'Ambiente Backend

Configurate in `docker-compose.yml`:

| Variabile | Descrizione | Default |
|-----------|-------------|---------|
| `APP_ENV` | Ambiente applicazione | `production` |
| `APP_DEBUG` | Debug mode | `false` |
| `DB_CONNECTION` | Tipo database | `sqlite` |
| `DB_DATABASE` | Percorso database SQLite | `/var/www/html/database/database.sqlite` |

### Variabili d'Ambiente Frontend

| Variabile | Descrizione | Default |
|-----------|-------------|---------|
| `VITE_API_URL` | URL API backend | `http://localhost:8000/api` |

## Avvio con Docker Compose

### Primo Avvio

```bash
git clone <repository-url>
cd user_management
docker-compose up -d
```

Verifica i container:
```bash
docker-compose ps
```

Accesso:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api

## Avvio Manuale

### Backend Laravel

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Crea `database/database.sqlite` e configura `.env`:
```
DB_CONNECTION=sqlite
DB_DATABASE=/percorso/assoluto/database/database.sqlite
```

```bash
php artisan migrate
php artisan serve
```

Backend disponibile su http://localhost:8000

### Frontend React

```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:8000/api" > .env
npm run dev
```

Frontend disponibile su http://localhost:5173

## API Endpoints

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| `GET` | `/api/users` | Lista utenti |
| `GET` | `/api/users/{id}` | Dettagli utente |
| `POST` | `/api/users` | Crea utente |
| `PUT` | `/api/users/{id}` | Aggiorna utente |
| `DELETE` | `/api/users/{id}` | Elimina utente |

### Esempio POST

```bash
curl -X POST http://localhost:8000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

### Validazione

- `first_name`: obbligatorio, stringa, max 255 caratteri
- `last_name`: obbligatorio, stringa, max 255 caratteri
- `email`: obbligatorio, email valida, univoca
- `password`: obbligatorio solo per creazione, minimo 8 caratteri

## Tecnologie Utilizzate

**Backend:**
- Laravel 11.x
- SQLite
- PHP 8.2

**Frontend:**
- React 19.x
- TypeScript
- Vite 7.x
- Tailwind CSS
- Radix UI
- Axios

## Note

- Il database SQLite viene creato automaticamente all'avvio
- Le migrazioni vengono eseguite automaticamente
- I dati persistono in `backend/database/`

## Note sulla Produzione

La configurazione attuale è pensata solo per sviluppo o demo locale.

Per un ambiente di produzione reale, sarebbe necessario adottare alcune accortezze:

- Usare Nginx o Apache per servire le richieste HTTP/HTTPS
- Configurare SSL/TLS per sicurezza
- PHP-FPM
- Non usare php artisan serve
- Laravel va eseguito tramite PHP-FPM, collegato a Nginx/Apache
- Database scalabile
- Sostituire SQLite con MySQL, PostgreSQL o altro database server
- Gestione variabili d’ambiente
- Passare le variabili tramite Docker secrets o environment sicure
