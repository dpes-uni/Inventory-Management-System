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
