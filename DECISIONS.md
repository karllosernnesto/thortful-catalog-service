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

## 007 - Use explicit DTOs and a compact service boundary

- Status: accepted
- Proposed by: AI suggestion from the approved implementation plan
- Decision: Keep the JPA entity internal, use request/response records for the API, and place query normalization and mutations in one concrete service.
- Rationale: DTOs prevent persistence annotations from defining the HTTP contract, while a single service remains easy to follow and extend.
- Trade-off: Mapping adds a small amount of code. Service and repository interfaces are deliberately omitted because there is only one implementation.

## 008 - Use database-backed optional filters and bounded pagination

- Status: accepted
- Proposed by: AI suggestion from the approved implementation plan
- Decision: Use one parameterized JPA query for optional title/artist search and category filtering. Pages are zero-based, default to 20 items, and are capped at 100.
- Rationale: Filtering and pagination stay server-side and the response size remains bounded for 1,200 records.
- Trade-off: SQL `LIKE` is sufficient at this scale but is not fuzzy or language-aware full-text search.

## 009 - Use stable newest-first sorting

- Status: accepted
- Proposed by: AI suggestion
- Decision: Sort by `createdAt DESC, id DESC` for every catalog request.
- Rationale: A deterministic secondary key prevents items with equal timestamps from moving unpredictably between pages.
- Trade-off: The API exposes one deliberate sort order rather than supporting arbitrary client-selected sorting.

## 010 - Seed deterministic data in application code

- Status: accepted
- Proposed by: AI suggestion
- Decision: Generate exactly 1,200 cards from fixed category, style, message, artist, price, and timestamp sequences when the database is empty.
- Rationale: Reviewers receive realistic volume with repeatable search/filter results and no large static data file.
- Trade-off: Generated combinations are representative rather than a curated production catalog.

## 011 - Keep React state local and dependencies minimal

- Status: accepted
- Proposed by: AI suggestion following the candidate's React/Vite choice
- Decision: Use React hooks, native `fetch`, native form controls, and `window.confirm` without a state library, router, form package, or component kit.
- Rationale: The page has one API resource and a small amount of coordinated state. Keeping it local makes the live-pairing extension path easy to understand.
- Trade-off: A larger application would benefit from shared server-state caching and a design system, but those dependencies would add more concepts than value here.

## 012 - Debounce search and retain the current page while updating

- Status: accepted
- Proposed by: AI suggestion from the approved UI plan
- Decision: Apply search 350 ms after typing stops, reset filters to page zero, request 12 cards per page, and leave existing cards visible during subsequent requests.
- Rationale: This limits avoidable API traffic and avoids a visually disruptive blank state for every filter or page transition.
- Trade-off: Search results intentionally lag input by a fraction of a second, and the implementation coordinates separate input and applied-search state.

## 013 - Use responsive CSS rather than a UI framework

- Status: accepted
- Proposed by: AI suggestion
- Decision: Use a three-, two-, and one-column card grid with two small breakpoints and accessible native controls.
- Rationale: The required layout is simple enough that a UI framework would add dependency and styling overhead.
- Trade-off: The project owns its CSS directly and does not receive prebuilt components or theme primitives.
