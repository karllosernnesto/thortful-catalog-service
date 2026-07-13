# Focused security review

## Executive summary

No critical, high, or medium-severity vulnerabilities were identified in the exercise scope. One low-severity supply-chain hygiene issue was fixed during final review: the frontend now commits a lockfile and uses `npm ci`. The final npm audit reports no known vulnerabilities.

The installed security-review guidance directly covers the React/JavaScript frontend. The Spring/Java backend was reviewed manually because that guidance pack does not include Java.

## Resolved finding

### SEC-001 - Frontend installs were not locked

- Rule ID: REACT-SUPPLY-001
- Severity: Low
- Status: Resolved
- Location: `frontend/Dockerfile:5-6`, `frontend/package-lock.json`
- Evidence: The original Dockerfile used `npm install` and no lockfile was committed. It now copies the package manifests and runs `npm ci` against the committed lockfile.
- Impact: Reviewers could previously receive different transitive dependency versions over time, weakening reproducibility and dependency-audit confidence.
- Fix: Generated and committed `package-lock.json`; changed Docker and documented installs to `npm ci`.
- Mitigation: Continue reviewing lockfile changes alongside dependency updates and run `npm audit` during final checks.
- False positive notes: None.

## Verified controls

- React renders API strings through normal JSX interpolation; no raw HTML or DOM injection sinks are used (`frontend/src/App.jsx:102-181`).
- API destinations are fixed same-origin relative paths; user input only enters encoded query parameters (`frontend/src/api.js:13-29`).
- No browser storage, authentication tokens, dynamic navigation, cross-window messaging, service workers, or third-party scripts are present.
- State-changing requests use POST and DELETE. The application has no cookie authentication, so CSRF is not currently applicable (`frontend/src/api.js:20-29`).
- Backend search is parameterized through JPA rather than SQL string construction (`backend/src/main/java/com/thortful/catalog/card/CardRepository.java:11-21`).
- Create requests have length, required-field, numeric-range, and decimal-place validation (`backend/src/main/java/com/thortful/catalog/card/CreateCardRequest.java:12-16`).
- The H2 console is disabled and Open Session in View is disabled (`backend/src/main/resources/application.properties:6-7`).
- No credentials or secret values are required or committed. The empty H2 password is limited to the ephemeral in-memory development database (`backend/src/main/resources/application.properties:2-4`).

## Deliberate local-exercise limitations

These are not treated as vulnerabilities in the current unauthenticated, local-only exercise, but they would need design work before production deployment:

- The Compose frontend runs Vite's development server and does not set production security headers such as CSP, clickjacking protection, or `X-Content-Type-Options`. A real deployment should serve the production build behind a configured web server or edge layer.
- The API has no authentication or authorization because the exercise defines a public catalog-management flow. A production write API would require both.
- Card IDs are sequential database IDs. This is easy to reason about for the exercise, but opaque public identifiers may be preferable when resource enumeration matters.
- TLS is intentionally absent locally and should be terminated by production infrastructure.
