# PLASTITRACK

PLASTITRACK is a community-driven plastic waste collection and redemption platform built as a React frontend with a Java Spring Boot backend.

## Project Structure

- `frontend/` - React + Vite user interface
- `backend/` - Java Spring Boot REST API
- `assets/` - original generated hero image used by the earlier static prototype
- `index.html`, `styles.css`, `app.js` - earlier static prototype kept for reference

## Main Modules

1. User Module
2. Collector Module
3. Administrator Module
4. Reward Management Module
5. Environmental Impact Module
6. Community Module

## Run Frontend

```powershell
cd frontend
npm install
npm run dev
```

The React app runs at `http://localhost:5173`.

## Run Backend

```powershell
cd backend
mvn spring-boot:run
```

The Spring Boot API runs at `http://localhost:8080`.

## Database

The backend connects to MySQL using Spring Data JPA. By default it expects:

- Database URL: `jdbc:mysql://localhost:3306/plastitrack?createDatabaseIfNotExist=true`
- Username: `root`
- Password: empty

For local development, create or run MySQL, then set these environment variables if your credentials are different:

```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/plastitrack?createDatabaseIfNotExist=true"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your_mysql_password"
mvn spring-boot:run
```

For cloud deployment, use the same variables with a managed MySQL database such as AWS RDS, Railway MySQL, Render MySQL-compatible storage, or any hosted MySQL service.

## API Endpoints

- `GET /api/stats`
- `GET /api/modules`
- `POST /api/pickups`
- `GET /api/pickups`
- `GET /api/impact`
- `GET /api/community-events`

Example pickup request:

```json
{
  "area": "Green Street Ward 4",
  "weightKg": 6,
  "plasticType": "PET bottles"
}
```
