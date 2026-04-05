# Welding Website Backend

This backend is designed for the existing static frontend in `welding_website/`. It replaces the current `localStorage` logic with a real MongoDB-powered REST API using Node.js, Express.js, JWT authentication, and clean project structure.

## 1. Frontend Requirements I Inferred

From your frontend, the application needs these backend modules:

- Admin authentication for `login.html`
- Admin profile for logged-in user settings
- Public customer reviews for `index.html`
- Worker daily and monthly records for `workers.html`
- Filtered reports for date-range and monthly summaries

## 2. Folder Structure

```text
backend/
│── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│── .env
│── .env.example
│── package.json
│── server.js
```

## 3. API Design

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`

### Profile

- `GET /api/profile`
- `PUT /api/profile`
- `PUT /api/profile/change-password`

### Reviews

- `GET /api/reviews`
- `POST /api/reviews`
- `PUT /api/reviews/:id`
- `DELETE /api/reviews/:id`
- `PATCH /api/reviews/:id/like`

### Workers

- `GET /api/workers`
- `POST /api/workers`
- `GET /api/workers/:id`
- `PUT /api/workers/:id`
- `DELETE /api/workers/:id`
- `GET /api/workers/reports/range?fromDate=2026-04-01&toDate=2026-04-30`
- `GET /api/workers/reports/monthly?month=4&year=2026`

### Health

- `GET /api/health`

## 4. JSON Response Format

### Success format

```json
{
  "success": true,
  "message": "Worker entry created successfully.",
  "data": {
    "entry": {}
  }
}
```

### Error format

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email address."
    }
  ]
}
```

## 5. Example Requests and Responses

### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "Secret123",
  "phone": "9876543210",
  "preferredLanguage": "en"
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "Secret123"
}
```

```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "6610...",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

### Create Review

```http
POST /api/reviews
Content-Type: application/json

{
  "name": "Hari",
  "email": "hari@example.com",
  "message": "Excellent welding work and fast delivery.",
  "rating": 5
}
```

### Create Worker Entry

```http
POST /api/workers
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "workDate": "2026-04-04",
  "workerNameEnglish": "Ravi",
  "workerNameTamil": "ரவி",
  "workTime": "Full-day",
  "salary": 800,
  "overtime": 150,
  "prepaid": 100,
  "notes": "Worked on roofing site"
}
```

## 6. How To Run Locally

### Step 1: Open backend folder

```bash
cd backend
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Configure environment

Update `.env` with your MongoDB Atlas connection string and JWT secret.

### Step 4: Start server

```bash
npm run dev
```

Your API will run on `http://localhost:5000`.

## 7. How To Connect Frontend To Backend

Replace current `localStorage` logic in the frontend with API calls:

- `GET /api/reviews` when `index.html` loads
- `POST /api/reviews` on review submit
- `PATCH /api/reviews/:id/like` when like is clicked
- `POST /api/auth/login` from `login.html`
- `GET /api/workers?date=2026-04-04` for daily view
- `GET /api/workers/reports/range?fromDate=2026-04-01&toDate=2026-04-30` for totals

Frontend base URL examples:

```js
const API_BASE_URL = "http://localhost:5000/api";
```

```js
const API_BASE_URL = "https://your-backend-name.onrender.com/api";
```

## 8. MongoDB Atlas Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas/database).
2. Create a free shared cluster.
3. Create a database user.
4. Add your IP address in Network Access.
5. Copy the Atlas connection string into `.env` as `MONGODB_URI`.

## 9. Render Deployment Guide

1. Push your project to GitHub.
2. Open [Render](https://render.com/) and create a free web service.
3. Set `Root Directory` to `backend`.
4. Set `Build Command` to `npm install`.
5. Set `Start Command` to `npm start`.
6. Add env vars: `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CORS_ORIGIN`, `DEFAULT_ADMIN_EMAIL`, `DEFAULT_ADMIN_PASSWORD`.
7. Deploy and use the generated Render URL in your frontend.

## 10. Free Deployment Stack

- Frontend: GitHub Pages or Netlify
- Backend: Render free tier
- Database: MongoDB Atlas free tier
- File storage later if needed: Cloudinary free tier

## 11. Security Features Included

- JWT authentication
- Password hashing with bcrypt
- Validation with `express-validator`
- Centralized error handling
- Rate limiting
- Helmet security headers
- Mongo sanitization
- XSS cleaning
- CORS protection
