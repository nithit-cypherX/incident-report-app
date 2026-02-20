# Incident Report App

A full-stack web application for managing safety and maintenance incident reports. Built with Go backend and React frontend.

![Tech Stack](https://img.shields.io/badge/Go-00ADD8?style=flat&logo=go&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)


## ✨ Features

- **Create Incident Reports** - Submit new safety or maintenance incidents
- **View All Incidents** - List all incidents with filtering capabilities
- **Edit Incidents** - Update existing incident details
- **Delete Incidents** - Remove incident reports
- **Filter & Search** - Filter by category (Safety/Maintenance) and status (Open/In Progress/Success)
- **Real-time Validation** - Frontend and backend validation using Zod
- **Responsive UI** - Works seamlessly on desktop and mobile devices
- **Toast Notifications** - User-friendly feedback for all actions

## 🛠 Tech Stack

### Backend
- **Go 1.21+** - Backend programming language
- **Gin** - HTTP web framework
- **GORM** - ORM for database operations
- **PostgreSQL** - Relational database
- **UUID** - Unique identifiers for records

### Frontend
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **TanStack Query** - Server state management
- **React Hook Form + Zod** - Form handling and validation
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client

### DevOps
- **Docker & Docker Compose** - Containerization
- **Git** - Version control

## Prerequisites

Before you begin, ensure you have the following installed:

- **Go 1.21 or higher** 
- **Node.js 18 or higher** 
- **Docker Desktop** 
- **Git**

Verify installations:

```bash
go version      # Should show go1.21 or higher
node --version  # Should show v18.x or higher
docker --version
git --version
```

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/nithit-cypherX/incident-report-app.git
cd incident-report-app
```

### 2. Set Up Backend

```bash
cd backend

# Install Go dependencies
go mod download
go mod tidy

# Create .env file
cp ../.env.example .env

# Your .env should contain:
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=postgres
# DB_PASSWORD=postgres
# DB_NAME=incident_db
# SERVER_PORT=8080
# CORS_ORIGIN=http://localhost:5173

cd ..
```

### 3. Set Up Frontend

```bash
cd frontend

# Install Node dependencies
npm install

cd ..
```

### 4. Start PostgreSQL Database

```bash
# Start PostgreSQL using Docker Compose
docker-compose up -d

# Verify it's running
docker ps
# You should see a container named 'incident_db'
```

## Running the Application

### Start Backend (Terminal 1)

```bash
cd backend
go run cmd/server/main.go
```

You should see:
```
Database connected successfully
Server running on port 8080
[GIN] Listening and serving HTTP on :8080
```

### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

You should see the Incident Report dashboard!

## API Documentation

### Base URL
```
http://localhost:8080/api/v1
```

### Endpoints

#### Health Check
```http
GET /health
```
**Response:**
```json
{
  "status": "ok"
}
```

#### Get All Incidents
```http
GET /api/v1/incidents
```
**Response:**
```json
[
  {
    "id": "uuid-here",
    "title": "Broken fire exit",
    "description": "Door is blocked",
    "category": "Safety",
    "status": "Open",
    "created_at": "2024-02-20T10:00:00Z",
    "updated_at": "2024-02-20T10:00:00Z"
  }
]
```

#### Get Single Incident
```http
GET /api/v1/incidents/:id
```
**Response:** Single incident object or 404 error

#### Create Incident
```http
POST /api/v1/incidents
Content-Type: application/json

{
  "title": "Broken fire exit",
  "description": "Door is blocked by boxes",
  "category": "Safety",
  "status": "Open"
}
```
**Response:** 201 Created with incident object

#### Update Incident
```http
PUT /api/v1/incidents/:id
Content-Type: application/json

{
  "title": "Broken fire exit",
  "description": "Being repaired",
  "category": "Safety",
  "status": "In Progress"
}
```
**Response:** 200 OK with updated incident object

#### Delete Incident
```http
DELETE /api/v1/incidents/:id
```
**Response:** 204 No Content


## Project Structure

```
incident-report-app/
├── backend/
│   ├── cmd/server/
│   │   └── main.go                 # Application entry point
│   ├── internal/
│   │   ├── database/
│   │   │   └── database.go         # Database connection
│   │   ├── handler/
│   │   │   └── incident_handler.go # HTTP handlers (controllers)
│   │   ├── service/
│   │   │   └── incident_service.go # Business logic
│   │   ├── repository/
│   │   │   └── incident_repository.go # Database operations
│   │   ├── model/
│   │   │   └── incident.go         # Database models
│   │   └── dto/
│   │       └── incident_dto.go     # Data transfer objects
│   ├── go.mod
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── features/
│   │   │   └── incidents/
│   │   │       ├── IncidentList.tsx      # Main page component
│   │   │       ├── IncidentCard.tsx      # Card component
│   │   │       ├── IncidentForm.tsx      # Form component
│   │   │       ├── DeleteConfirmDialog.tsx
│   │   │       ├── useIncidents.ts       # React Query hooks
│   │   │       ├── incidentService.ts    # API calls
│   │   │       └── incidentSchema.ts     # Zod validation
│   │   ├── components/ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Select.tsx
│   │   ├── lib/
│   │   │   ├── api.ts              # Axios client
│   │   │   └── utils.ts            # Utility functions
│   │   ├── types/
│   │   │   └── incident.ts         # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

## Architecture

### Backend - 3-Layer Architecture

```
┌─────────────────┐
│  HTTP Request   │
└────────┬────────┘
         │
    ┌────▼────┐
    │ Handler │  ← Parse request, return response
    └────┬────┘
         │
    ┌────▼────┐
    │ Service │  ← Business logic & validation
    └────┬────┘
         │
    ┌────▼────────┐
    │ Repository  │  ← Database operations
    └────┬────────┘
         │
    ┌────▼────────┐
    │ PostgreSQL  │
    └─────────────┘
```


### Frontend - Feature-Based Structure

All code related to a feature lives together:
```
features/incidents/
  ├── Components  (IncidentList, IncidentCard, IncidentForm)
  ├── Hooks       (useIncidents, useCreateIncident, etc.)
  ├── Service     (incidentService.ts)
  └── Schema      (incidentSchema.ts)
```

## Environment Variables

### Backend (.env)
```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=incident_db
SERVER_PORT=8080
CORS_ORIGIN=http://localhost:5173
```

### Frontend (optional .env.local)
```bash
VITE_API_URL=http://localhost:8080/api/v1
```

