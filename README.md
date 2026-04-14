<p align="center">
  <img src="./frontend/src/assets/fraxxra.png" alt="Fraxxra Logo" width="80" />
</p>

<h1 align="center">Fraxxra</h1>
<p align="center">
  <b>A modern, full-stack project management system built for speed and clarity.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-v20-339933?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white" />
</p>

---

## ✨ Features

- **Project & Task Management** — Full CRUD with status tracking (To Do, In Progress, Completed) and priority levels (Low, Medium, High).
- **Secure Cookie-based Auth** — JWT tokens stored in HTTP-only cookies; no client-side token exposure.
- **Server-side Pagination & Search** — Efficient, paginated APIs with regex-based search for both projects and tasks.
- **Protected Routes** — Auth-aware route guards with automatic redirection.
- **Premium UI** — Glassmorphism, smooth animations, and a responsive sidebar layout built with Tailwind CSS and Radix UI.
- **Dockerized** — One-command setup with Docker Compose for both services.

---

## 🏗 Architecture

```
Fraxxra/
├── backend/                # Express.js REST API
│   └── src/
│       ├── config/         # DB connection, env vars, logger
│       ├── controllers/    # Route handlers
│       ├── middlewares/     # Auth middleware, error handler
│       ├── models/         # Mongoose schemas (User, Project, Task)
│       ├── routes/         # API route definitions
│       ├── services/       # Business logic layer
│       ├── utils/          # ApiResponse, ApiError, asyncHandler
│       └── validators/     # Joi request validation
├── frontend/               # React 19 + Vite SPA
│   └── src/
│       ├── components/     # MainLayout, ShadCN UI components
│       ├── pages/          # Dashboard, Projects, ProjectDetails, SignIn, SignUp
│       ├── services/       # Axios API clients (auth, project, task)
│       └── store/          # Redux Toolkit (authSlice)
├── docker-compose.yml      # Orchestrates both services
└── .gitignore
```

---

## 🛠 Tech Stack

| Layer      | Technology                                                                 |
| ---------- | -------------------------------------------------------------------------- |
| **Frontend** | React 19, Vite 8, Tailwind CSS 4, Radix UI, Redux Toolkit, React Hook Form, Zod |
| **Backend**  | Express 5, Mongoose 9, JWT, Bcrypt.js, Joi, Winston                         |
| **Database** | MongoDB Atlas                                                              |
| **DevOps**   | Docker, Docker Compose                                                     |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [MongoDB](https://www.mongodb.com/) (Atlas or local)
- [Docker](https://www.docker.com/) _(optional, for containerized setup)_

### 1. Clone the Repository

```bash
git clone https://github.com/ajeetk7ev/Fraxxra-projectmgt.git
cd Fraxxra-projectmgt
```

### 2. Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=24h
COOKIE_EXPIRE=1
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Run Locally (Without Docker)

**Backend:**

```bash
cd backend
npm install
npm run dev
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and the backend at `http://localhost:5000`.

### 4. Run with Docker Compose

```bash
docker-compose up --build
```

Both services start with hot-reloading enabled.

---

## 📡 API Reference

Base URL: `http://localhost:5000/api/v1`

### Auth

| Method | Endpoint         | Description            | Auth |
| ------ | ---------------- | ---------------------- | ---- |
| POST   | `/auth/register` | Create a new account   | No   |
| POST   | `/auth/login`    | Sign in (sets cookie)  | No   |
| POST   | `/auth/logout`   | Sign out (clears cookie) | Yes  |
| GET    | `/auth/me`       | Get current user       | Yes  |

### Projects

| Method | Endpoint          | Description                      | Auth |
| ------ | ----------------- | -------------------------------- | ---- |
| GET    | `/projects`       | List projects (paginated, search) | Yes  |
| POST   | `/projects`       | Create a project                 | Yes  |
| GET    | `/projects/:id`   | Get project by ID                | Yes  |
| PUT    | `/projects/:id`   | Update a project                 | Yes  |
| DELETE | `/projects/:id`   | Delete a project                 | Yes  |

**Query Params:** `?page=1&limit=9&search=keyword`

### Tasks

| Method | Endpoint                   | Description                        | Auth |
| ------ | -------------------------- | ---------------------------------- | ---- |
| GET    | `/tasks/project/:projectId` | List tasks (paginated, filterable) | Yes  |
| POST   | `/tasks`                   | Create a task                      | Yes  |
| PUT    | `/tasks/:id`               | Update a task                      | Yes  |
| DELETE | `/tasks/:id`               | Delete a task                      | Yes  |

**Query Params:** `?page=1&limit=6&search=keyword&status=todo&priority=high`

---

## 📁 Key Design Decisions

| Decision                        | Rationale                                                                                      |
| ------------------------------- | ---------------------------------------------------------------------------------------------- |
| **HTTP-only cookies over localStorage** | Prevents XSS token theft; cookies are automatically sent with every request via `withCredentials`. |
| **Controller → Service pattern**       | Separates HTTP concerns from business logic for cleaner, testable code.                             |
| **Server-side pagination**             | Keeps the client lean; only fetches the data it needs per page.                                     |
| **Radix UI + Tailwind**                | Accessible primitives + utility-first styling for rapid, consistent UI development.                 |

---

## 📝 License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).
