# thortful catalog service

A small Spring Boot and React catalog application for the thortful backend Java technical exercise.

Milestone 1 provides the runnable foundation and verifies communication between the two applications. Catalog data and operations are intentionally reserved for Milestone 2.

## Requirements

The primary workflow requires only:

- Docker Desktop, or Docker Engine
- Docker Compose v2 (`docker compose`)
- Git

Java, Maven, Node.js, and npm are not required on the host when using Docker Compose.

## Start the complete application

From the repository root:

```bash
docker compose up --build
```

Open:

- Frontend: http://localhost:5173
- Backend health endpoint: http://localhost:8080/api/health

The frontend calls `/api/health`. Vite proxies this request to the `backend` service over the private Compose network, so the browser does not need to know the container hostname and no development CORS configuration is required.

Stop the application with `Ctrl+C`, or from another terminal:

```bash
docker compose down
```

Remove containers and reset application data:

```bash
docker compose down --volumes --remove-orphans
```

The current H2 database is in memory and no database volume is configured, so its data is already reset whenever the backend container or process stops. The `--volumes` option makes the intended full-reset workflow explicit if persistent volumes are introduced later.

## Tests

Run backend tests in the same container environment used by the application:

```bash
docker compose run --build --rm backend mvn test
```

Run frontend tests:

```bash
docker compose run --build --rm frontend npm test
```

## Optional non-Docker development

Backend requirements:

- Java 21 or later
- Maven 3.9 or later

```bash
cd backend
mvn spring-boot:run
```

Frontend requirements:

- Node.js 22
- npm 10 or later

```bash
cd frontend
npm install
npm run dev
```

With both processes running locally, Vite defaults its `/api` proxy to `http://localhost:8080`. Tests can be run with `mvn test` in `backend/` and `npm test` in `frontend/`.

No additional platform-specific setup is currently required. On Linux, the Docker user may need permission to access the Docker daemon according to the Docker Engine installation instructions.

## Architecture

```text
Browser :5173
    |
    | /api/*
    v
React + Vite (frontend container)
    |
    | Vite proxy over Compose network
    v
Spring Boot (backend container) :8080
    |
    v
H2 in-memory database
```

- `backend/` contains the Spring Boot API.
- `frontend/` contains the React/Vite UI.
- `compose.yaml` builds and connects both services.
- Each service has its own Dockerfile and dependency boundary.

This separation adds two builds, two containers, and proxy configuration compared with serving static files from Spring Boot. The accepted benefit is clearer frontend/backend ownership, a modern React development workflow, and a reproducible setup that does not depend on host Java or Node installations.

H2 is configured as `jdbc:h2:mem:catalog` with Hibernate `create-drop`. Data exists only for the lifetime of the backend process and will be rebuilt and seeded on every restart once Milestone 2 adds the catalog model. This is deliberate for a repeatable interview exercise, not a production persistence strategy.

More detailed decisions are recorded in [DECISIONS.md](DECISIONS.md), and AI collaboration is recorded in [AI_USAGE.md](AI_USAGE.md).

## Troubleshooting

### Port 5173 or 8080 is already in use

Stop the process using the port, or change the host side of the relevant mapping in `compose.yaml`. For example, `5174:5173` exposes the frontend at http://localhost:5174 without changing the container port.

### A container exits or does not become healthy

Inspect service state and logs:

```bash
docker compose ps
docker compose logs backend
docker compose logs frontend
```

After correcting the issue, rebuild from a clean application state:

```bash
docker compose down --remove-orphans
docker compose up --build
```

### Dependency download or image build fails

Confirm Docker can access the internet, then retry the build. Corporate proxies may need to be configured in Docker Desktop or the Docker daemon.

## Planned next milestone

Milestone 2 will add the card entity, deterministic sample data, paginated listing, search, category filtering, creation, and deletion. Those features are intentionally absent from this foundation commit.
