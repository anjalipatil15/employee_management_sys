# Employee Management System (Primo)

A small demo Employee Management System built with Node.js, Express and SQLite. The project provides a simple login flow (demo users), a dashboard, profile view, tasks page and basic employees CRUD endpoints backed by a local SQLite database.

This repository is intended as a lightweight demo and learning project — not production-ready. It includes demo credentials and stores passwords in plaintext for convenience.

---

## Quick overview

- Server: Express (serves static files from the project root)
- Database: SQLite (local file `database.db`)
- Frontend: plain HTML, CSS and JavaScript pages (no build step)
- Start command: `npm start` (runs `node server.js`)

## Prerequisites

- Node.js (v14+ recommended) and npm installed on your machine

## Installing

Open a terminal in the project root (`c:\Anjali\employee_management_sys`) and run:

```powershell
npm install
```

> Note: this repo already includes a `node_modules` folder in the workspace; running `npm install` will ensure any missing dependencies are installed or consistent with package-lock.

## Running

Start the server:

```powershell
npm start
# or
node server.js
```

By default the server listens on port 3000. Open your browser to:

- http://localhost:3000/index1.html  — Login page
- http://localhost:3000/dashboard.html — Dashboard (requires login)

The server serves the static HTML files from the repository root and exposes a few JSON API endpoints used by the frontend.

## Demo credentials

These demo users are available out-of-the-box (defined in `server.js` and `script.js`):

- admin@company.com / admin123  (admin)
- hr@company.com / hr123        (hr)
- manager@company.com / manager123  (manager)
- employee@company.com / emp123 (employee)

Use any of the above credentials from the login page to access the UI.

## API endpoints

The running server exposes these minimal endpoints used by the UI:

- POST /login
  - Request JSON: { username, password }
  - Response: JSON with user info on success or 401 on invalid creds

- GET /employees
  - Returns JSON array of employees from the SQLite DB

- POST /employees
  - Request JSON: { name, email, role }
  - Inserts or updates an employee and returns the saved record

The server uses a local SQLite file `database.db` (created automatically when the server first runs).

## File map (important files)

- `server.js` — Express server, DB initialization, API endpoints
- `script.js` — Frontend JS for login and UI interactions
- `index1.html` — Login page
- `dashboard.html` — Main dashboard
- `tasks-page.html` — Tasks UI
- `employees.html` — Employee list (live view)
- `profile.html` — User profile page
- `database.db`, `users.db` — local SQLite files (data files)
- `package.json` — project metadata and start script

## Security & production notes

- Passwords in demo users and the simple DB checks are plaintext — do not use this in production.
- The project is intentionally minimal (no authentication tokens, no hashing, limited validation). If you plan to harden it, consider:
  - Hashing passwords (bcrypt)
  - Adding sessions or JWT-based auth
  - Using parameterized queries and careful input validation
  - Moving DB access to a separate module and adding proper error handling

## Troubleshooting

- If a port is already in use, either free port 3000 or edit `server.js` to change the port.
- If frontend pages show blank/redirect to login, check `localStorage.currentUser` in your browser devtools — the app expects a `currentUser` object after login.