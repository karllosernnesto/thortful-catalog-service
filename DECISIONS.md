# Decision log

This is a concise record of decisions made during the exercise. “Candidate” identifies explicit user decisions; “AI suggestion” identifies proposals made by the assistant.

## 001 - Use a greeting-card catalog domain

- Status: accepted
- Proposed by: AI suggestion
- Decision: Model the exercise around greeting cards because the domain fits thortful and gives search and filtering meaningful fields.
- Consequence: Milestone 2 can use understandable attributes such as title, artist, category, and price without inventing a complex domain.

## 002 - Separate Spring Boot and React/Vite applications

- Status: accepted, overriding the initial AI suggestion
- Initial AI suggestion: Serve a vanilla JavaScript UI from a single Spring Boot application to minimize tooling and runtime complexity.
- Candidate decision: Use a Spring Boot backend under `backend/` and a React/Vite frontend under `frontend/`.
- Rationale: The candidate chose clearer frontend/backend separation and a modern UI development experience.
- Trade-off: The repository now has two dependency graphs, two builds, proxy configuration, and more runtime components. This is acceptable while both applications remain deliberately small.

## 003 - Make Docker Compose the primary workflow

- Status: accepted, chosen by candidate
- Candidate decision: The complete application must start with `docker compose up --build` and must not require host Java, Maven, Node.js, or npm.
- Rationale: A containerized workflow provides a reproducible reviewer setup and makes runtime versions explicit.
- Trade-off: Initial image downloads and container builds are slower than direct local startup, and Docker networking adds a layer to troubleshoot.

## 004 - Proxy browser API requests through Vite

- Status: accepted
- Proposed by: AI suggestion in response to the candidate's split-application decision
- Decision: The React application calls relative `/api` URLs. Vite proxies those calls to `http://backend:8080` in Compose and `http://localhost:8080` during optional local development.
- Rationale: This avoids hard-coded browser-facing backend URLs and development-only CORS configuration.
- Consequence: A production deployment would need an equivalent reverse proxy or an explicit API base URL.

## 005 - Use an in-memory H2 database

- Status: accepted
- Proposed by: AI suggestion; permitted by the exercise and retained by candidate
- Decision: Use H2 in-memory storage with schema recreation at startup.
- Rationale: It keeps startup and sample data deterministic and avoids adding PostgreSQL inside the timebox.
- Consequence: All data is lost whenever the backend process restarts. It is suitable for this exercise, not durable production storage.

## 006 - Optimize for a live extension task

- Status: accepted
- Source: exercise requirement and shared candidate/AI goal
- Decision: Prefer direct, conventional Spring and React code over additional abstraction layers.
- Rationale: Reviewers will ask the candidate to add a feature during a 45-minute pairing interview.
- Consequence: Interfaces, generic frameworks, authentication, external search infrastructure, and production deployment concerns remain out of scope unless requirements change.
