# Steakz Lighter

Full-stack restaurant management portal built with:

- Backend: Express 5, Prisma 6, PostgreSQL, TypeScript, JWT
- Frontend: React 19, React Router 7, Vite 8, Axios

## Structure

- `backend/` - Express REST API
- `frontend/` - React SPA

## Quick start

### Backend

1. Copy `backend/.env.example` to `backend/.env`
2. Update `DATABASE_URL` and secrets
3. Run `npm install`
4. Run `npx prisma migrate dev --name init`
5. Run `npm run dev`

### Frontend

1. Run `npm install` inside `frontend/`
2. Run `npm run dev`

The frontend is configured to proxy API requests from `http://localhost:5173` to `http://localhost:3001`.
