# SnippetStack — Your Personal Code Library & AI Prompts

> A full-stack developer dashboard for organizing, searching, managing, and copying reusable code snippets, developer commands, and AI prompts with a persistent MongoDB database.

---

## 1. Project Overview

**SnippetStack** is a modern, high-performance personal code and prompt repository built for developers, students, and engineers. It solves the everyday friction of losing track of handy one-liners, complex SQL queries, algorithmic patterns, Docker/Git commands, and carefully crafted AI system prompts.

Designed with a developer-first visual hierarchy:
- **Palette**: Deep slate backgrounds (`#0B1120`, `#111827`, `#151F32`), vibrant emerald (`#10B981`) & teal accents (`#14B8A6`), and crisp typography.
- **Persistent Database**: Real-time MongoDB storage via Mongoose that can be inspected and managed in **MongoDB Compass**.
- **Real-Time Dynamic Metrics**: Instant calculation of total snippets, distinct languages, favorited items, and snippets added in the past 7 days.
- **Developer Experience**: One-click clipboard copying, syntax highlighting with Prism.js, responsive multi-column layouts, tag filtering, and instant multi-field search.

---

## 2. Features

- **Full-Text & Multi-Field Search**: Real-time filtering across titles, descriptions, code content, tags, programming languages, and categories simultaneously.
- **Smart Categorization & Content Types**: Dedicated support for **Code Snippets**, **AI Prompts** (formatted for reading), and **Terminal Commands** (with terminal styling).
- **Interactive Snippet Cards**:
  - Live syntax highlighting (Python, JavaScript, SQL, Bash, JSON, C, C++, Java, etc.).
  - Instant copy to clipboard with toast confirmation.
  - One-click favorite bookmarking with optimistic UI updates.
  - Clickable tag pills to filter similar snippets.
- **Full CRUD Management**:
  - Add new snippets with multi-tag chip inputs, language selection, and validation.
  - View full snippet details with character/line counters and full-screen formatted code.
  - In-place editing of all fields.
  - Safe deletion with a confirmation dialog displaying the exact title.
- **Live Database Health Status**:
  - Automatic backend health check on `/api/health` displaying MongoDB connection status (`localhost:27017`).
- **Database Seeding Script**:
  - Pre-packaged with 6 realistic code examples and prompts (safe to re-run with zero duplicate records).

---

## 3. Technology Stack

### Frontend
- **React 18 / 19** with **Vite**
- **Modern CSS** with custom design system variables, glassmorphism, and responsive CSS grid
- **Lucide React** (clean, modern developer iconography)
- **Prism.js** (syntax highlighting for multiple programming languages)

### Backend
- **Node.js** (v18+)
- **Express.js** (REST API architecture)
- **Mongoose 8** (MongoDB Object Document Modeling)
- **dotenv** (environment configuration)
- **cors** (cross-origin resource sharing)

### Database & Tools
- **MongoDB Community Server** (running locally on port `27017`)
- **MongoDB Compass** (database visualization and inspection)
- **Database Name**: `snippetstack`
- **Collection Name**: `snippets`

---

## 4. Architecture & Request Flow

```
+-------------------------------------------------------------+
|                React + Vite Client (Port 5173)              |
|   Navbar | Hero | StatsCards | FilterBar | SnippetGrid      |
|           SnippetModal | SnippetDetailModal                 |
+------------------------------+------------------------------+
                               |
                   HTTP / REST (JSON API)
                               |
+------------------------------v------------------------------+
|               Express.js Server (Port 5000)                 |
|   Routes: /api/health, /api/snippets, /api/snippets/stats   |
|   Middleware: CORS, BodyParser, Centralized ErrorHandler    |
|   Controller: snippetController.js                          |
+------------------------------+------------------------------+
                               |
                        Mongoose 8 ODM
                               |
+------------------------------v------------------------------+
|                MongoDB Server (Port 27017)                  |
|                 Database: `snippetstack`                    |
|                 Collection: `snippets`                      |
|                                                             |
|           [Inspectable via MongoDB Compass GUI]             |
+-------------------------------------------------------------+
```

---

## 5. Project Folder Structure

```
snippetstack/
├── client/                      # React + Vite Frontend
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/          # Modular UI Components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── StatsCards.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── SnippetCard.jsx
│   │   │   ├── SnippetGrid.jsx
│   │   │   ├── SnippetModal.jsx
│   │   │   ├── SnippetDetailModal.jsx
│   │   │   ├── DeleteConfirmModal.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── Toast.jsx
│   │   ├── services/
│   │   │   └── api.js           # Centralized API service
│   │   ├── utils/
│   │   │   ├── constants.js     # Languages, categories, color maps
│   │   │   └── formatters.js    # Dates, Prism grammars, clipboard
│   │   ├── App.jsx              # Main App Component
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Dark emerald theme & design system
│   ├── .env.example
│   ├── .env
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Node.js + Express Backend
│   ├── config/
│   │   └── db.js                # MongoDB Mongoose connection handler
│   ├── models/
│   │   └── Snippet.js           # Mongoose Schema & Indexes
│   ├── controllers/
│   │   └── snippetController.js # REST API business logic
│   ├── routes/
│   │   └── snippetRoutes.js     # Express endpoint router
│   ├── middleware/
│   │   └── errorHandler.js      # Centralized error handler
│   ├── scripts/
│   │   ├── seed.js              # Idempotent database seeder (6 snippets)
│   │   └── testApi.js           # Automated 7-point API test runner
│   ├── .env.example
│   ├── .env
│   ├── server.js                # Server entry point
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 6. Prerequisites

Ensure you have the following installed on your machine:
1. **Node.js** (v18.0.0 or later) and **npm**: [Download Node.js](https://nodejs.org/)
2. **MongoDB Community Server**: [Download MongoDB Community](https://www.mongodb.com/try/download/community)
3. **MongoDB Compass**: [Download MongoDB Compass](https://www.mongodb.com/try/download/compass)

---

## 7. Connecting to MongoDB Compass

MongoDB Compass is the official graphical client for MongoDB. It allows you to visually inspect, filter, query, create, edit, and delete documents stored by SnippetStack.

### Connection Steps:
1. Open **MongoDB Compass**.
2. In the "New Connection" screen, enter the local connection URI:
   ```text
   mongodb://127.0.0.1:27017
   ```
3. Click **Connect**.
4. In the left navigation sidebar:
   - Look for the **`snippetstack`** database.
   - Click on the **`snippets`** collection.
5. You can now browse all documents saved by SnippetStack!

> **Note**: In MongoDB, a database and collection are only permanently created on disk once the first document is inserted. If you connect Compass before inserting any document, run `npm run seed` in `server/` to immediately populate it.

---

## 8. Installation & Setup

### Step 1: Clone or Navigate to the Workspace
```bash
cd snippetstack
```

### Step 2: Configure Backend Environment Variables
```bash
cd server
copy .env.example .env
```
Default `server/.env` contents:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/snippetstack
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Step 3: Install Backend Dependencies
```bash
npm install
```

### Step 4: Seed Sample Data
Populate the database with 6 production-grade sample snippets:
```bash
npm run seed
```
*(This script is idempotent: you can run it anytime without creating duplicate entries).*

### Step 5: Start the Backend Server
```bash
npm run dev
# or: npm start
```
The server will start at `http://localhost:5000`.

---

### Step 6: Configure & Start Frontend

Open a **second terminal window**:

```bash
cd snippetstack/client
copy .env.example .env
npm install
npm run dev
```

The frontend will start at:
`http://localhost:5173`

---

## 9. API Endpoint Documentation

All endpoints return standard JSON responses:
- Success: `{ "success": true, "data": ... }`
- Error: `{ "success": false, "message": "Reason for error" }`

| Method | Endpoint | Description | Query Parameters / Body |
|---|---|---|---|
| `GET` | `/api/health` | Check API & MongoDB connection status | None |
| `GET` | `/api/snippets/stats` | Retrieve dynamic statistics | None |
| `GET` | `/api/snippets` | Retrieve snippets list | `search`, `category`, `language`, `contentType`, `favorite`, `sortBy` |
| `GET` | `/api/snippets/:id` | Get single snippet by MongoDB ID | None |
| `POST` | `/api/snippets` | Create a new snippet | Body: `title`, `description`, `contentType`, `language`, `category`, `content`, `tags`, `isFavorite` |
| `PUT` | `/api/snippets/:id` | Update snippet fields | Body: fields to update |
| `PATCH` | `/api/snippets/:id/favorite` | Toggle or set favorite state | Body: `{ isFavorite: boolean }` (optional) |
| `DELETE` | `/api/snippets/:id` | Delete snippet permanently | None |

---

## 10. Automated API Testing

SnippetStack includes an automated test runner that tests all 7 REST endpoints against your live MongoDB database:

```bash
cd server
node scripts/testApi.js
```

Expected output:
```text
--- Starting SnippetStack API Verification Tests ---
[1/7] Testing GET /api/health... (200 OK)
[2/7] Testing GET /api/snippets/stats... (200 OK)
[3/7] Testing GET /api/snippets... (200 OK)
[4/7] Testing POST /api/snippets (Create)... (201 Created)
[5/7] Testing PUT /api/snippets/:id (Update)... (200 OK)
[6/7] Testing PATCH /api/snippets/:id/favorite... (200 OK)
[7/7] Testing DELETE /api/snippets/:id (Delete)... (200 OK)
======================================================
 ALL 7 API ENDPOINTS VERIFIED SUCCESSFULLY AGAINST MONGODB!
======================================================
```

---

## 11. Troubleshooting & FAQ

### 1. MongoDB Connection Refused (`ECONNREFUSED 127.0.0.1:27017`)
- **Cause**: The local MongoDB service is not running.
- **Solution on Windows**:
  - Open PowerShell as Administrator and run:
    ```powershell
    net start MongoDB
    ```
  - Or press `Win + R`, type `services.msc`, locate **MongoDB Server**, right-click and click **Start**.

### 2. Port 5000 Already in Use (`EADDRINUSE`)
- **Solution**: Change `PORT=5001` in `server/.env` and update `VITE_API_URL=http://localhost:5001/api` in `client/.env`.

### 3. MongoDB Compass Does Not Show `snippetstack`
- **Solution**: MongoDB creates databases on demand. Run `npm run seed` inside the `server/` folder to populate the database and click the Refresh button in Compass.

---

## 12. License
MIT License. Built with passion for developers.
