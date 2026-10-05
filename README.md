# Inventory Management System

A full-stack inventory management application built for university assessment.

**Tech stack:**

- **Frontend:** React 18 + Vite + React Router + Tailwind CSS
- **Backend:** Node.js + Express + REST API
- **Database:** MongoDB (Mongoose ODM)
- **Auth:** JWT (passwords hashed with bcryptjs, never stored as plaintext)

## Project structure

```
Inventory-Management-System/
├── frontend/                 # React + Vite application
│   ├── public/
│   └── src/
│       ├── components/       # Shared UI components (Layout, ProductForm, LoadingSpinner)
│       ├── pages/            # Login, Inventory, Product Details, Add/Edit Product
│       ├── context/          # React context (AuthContext)
│       ├── services/         # Axios client + API services
│       ├── routes/           # ProtectedRoute wrapper
│       ├── App.jsx           # Client-side routing
│       ├── main.jsx          # Entry point
│       └── index.css         # Tailwind + custom styles
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── config/           # Environment configuration
│   │   ├── models/           # Mongoose models (User, Product)
│   │   ├── routes/           # API route modules (auth, products)
│   │   ├── middleware/       # Shared middleware (auth, errorHandler)
│   │   ├── app.js            # Express app definition
│   │   └── server.js         # HTTP server entry point + MongoDB connection
│   ├── tests/                # Test suite (auth, products CRUD)
│   ├── .env.example          # Environment variable template
│   └── package.json
├── API_CONTRACT.md           # REST API contract
├── README.md
└── .gitignore
```

## Features

- **Authentication:** JWT-based login with session persistence and route protection. Passwords are hashed with bcryptjs and never stored as plaintext.
- **Products CRUD:** List, view, create, update, and delete products via a REST API.
- **Validation:** Server-side validation (Joi) on every write operation; client-side validation on forms.
- **Error handling:** Consistent JSON error responses (400/401/404/500) with a central Express error handler.
- **Responsive UI** with accessible form controls, keyboard navigation support, and live region announcements.
- **State management** via React Context (auth) and component state.
- **Asynchronous API communication** via Axios with request/response interceptors.

## Getting started

### Prerequisites

- Node.js >= 18
- npm
- MongoDB (local or cloud)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and secrets
npm run dev
```

The backend starts on `http://localhost:5000` (configurable via `PORT`) and connects to MongoDB automatically on startup. A sample user (`testuser` / `testpass`) is created on first run if none exists.

### 2. Frontend

```bash
cd ../frontend
npm install
npm run dev
```

The frontend starts on `http://localhost:5176`. In dev mode, `/api` requests are proxied to the backend.

### 3. Database

Connect MongoDB by setting `MONGO_URI` in `backend/.env`. The Mongoose models are wired in `backend/src/models/` when CRUD is implemented.


## Testing

```bash
cd backend
npm test
```

## Deployment

This application is designed for deployment to:

- **Frontend:** [Vercel](https://vercel.com)
- **Backend:** [Render](https://render.com)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Prerequisites

- Node.js >= 18
- npm
- MongoDB Atlas account and cluster
- GitHub account (for Vercel/Render deployment)

### 1. MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free cluster
2. Create a database user with a strong password
3. Whitelist your IP (or use `0.0.0.0/0` for flexibility)
4. Note the connection string: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/inventory_management`

### 2. Backend (Render)

1. Connect your GitHub repo to [Render](https://render.com)
2. Create a new **Web Service**
   - Environment: Node
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm run start`
3. Add **Environment Variables** in the Render dashboard:
   - `MONGO_URI` — the Atlas connection string
   - `JWT_SECRET` — a random secure string (e.g., `openssl rand -hex 32`)
   - `CORS_ORIGIN` — will be updated after frontend is deployed (see step 9 below)
   - `NODE_ENV=production` (Render sets this automatically, or set it)
4. Deploy

After deployment, note the Render backend URL (e.g., `https://inventory-api-xyz.onrender.com`).

### 3. Frontend (Vercel)

1. Connect your GitHub repo to [Vercel](https://vercel.com)
2. Import the project
   - Framework: Vite
   - Root Directory: `frontend` (if auto-detected from repo root)
3. Add **Environment Variables** in the Vercel dashboard:
   - `VITE_API_URL` — the Render backend URL + `/api` (e.g., `https://inventory-api-xyz.onrender.com/api`)
4. (Optional) Add `vercel.json` — already added at repo root for SPA routing
5. Deploy

### 4. Finalize CORS

After the frontend is deployed and you have the Vercel URL:

1. Go to Render dashboard → your service → Environment
2. Update `CORS_ORIGIN` to `https://<vercel-url>.vercel.app` (e.g., `https://inventory-frontend.vercel.app`)
3. Redeploy the backend

### 5. Seed Test Accounts (for E2E testing)

Run the seed script locally (or via Render one-off task) to create admin/staff accounts:

```bash
cd backend
npm install
npm run seed
```

Accounts created:
- **Admin:** username=`testuser`, password=`testpass`, role=`admin`
- **Staff:** username=`staffuser`, password=`staffpass`, role=`staff`

Alternatively, create accounts manually via MongoDB Atlas or a MongoDB client.

### 6. End-to-End Testing

After all services are deployed:

- Visit the Vercel frontend URL
- Log in as admin (`testuser` / `testpass`) or staff (`staffuser` / `staffpass`)
- Test all CRUD operations, authentication, and role-based access

### Backend Deployment Notes

- The backend reads `PORT` from Render's environment; `5000` is the local fallback
- MongoDB connection uses `MONGO_URI` from environment variables
- JWT secret uses `JWT_SECRET` from environment variables
- CORS origin uses `FRONTEND_URL` → then `CORS_ORIGIN` → then `http://localhost:5173`

### Frontend Deployment Notes

- The frontend API client uses `VITE_API_URL` environment variable
- If `VITE_API_URL` is unset, falls back to `/api` (relative, enabled by the Vite dev proxy)
- The `vercel.json` at repo root ensures React Router direct navigation works
- Loading/error states are handled in each page component
