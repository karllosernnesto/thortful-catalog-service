# AI usage record

The full assistant conversation will be supplied with the exercise. This file is an index of material AI contributions and the candidate's response; it does not replace or sanitize the transcript.

## Planning

### Exercise review and initial proposal

- AI output: Extracted the two-page PDF requirements and evaluation criteria.
- AI suggestion: A single Spring Boot application serving a vanilla JavaScript UI, backed by H2 and started with Maven.
- Candidate response: Modified. The candidate explicitly required separate `backend/` and `frontend/` applications, React/Vite, separate Dockerfiles, and Docker Compose as the primary host workflow.
- Accepted trade-off: Additional build/runtime complexity in exchange for clearer frontend/backend separation, modern UI development, and reproducible containerized setup.

### Retained suggestions

- AI suggestion accepted by candidate: Use a greeting-card catalog domain.
- AI suggestion accepted by candidate: Use H2 rather than introduce PostgreSQL within the timebox.
- AI suggestion accepted by candidate: Keep tests focused on important behavior and keep the architecture easy to extend during live pairing.

## Milestone 1 - runnable foundation

- Candidate instruction: Begin only the runnable foundation; reserve all catalog functionality for Milestone 2.
- AI contribution: Generated the initial Spring Boot scaffold, React/Vite scaffold, Dockerfiles, Compose configuration, smoke endpoint/page, tests, README, decision log, and this usage record.
- Candidate review status: Awaiting review and commit approval.
- Modifications or rejections: To be recorded after candidate review.

### Candidate review outcome

- Candidate accepted the generated foundation and exact first commit message.
- AI verification found vulnerable initial Vite/Vitest pins before commit; the AI updated them within their major versions and confirmed a zero-vulnerability npm audit result.
- Candidate pushed the approved commit to `origin/main`.

## Milestone 2 - catalog backend

- Candidate instruction: Implement only the card model, DTOs, deterministic seed data, server-side pagination/search/filtering/sorting, bounded page sizes, create/delete operations, validation, HTTP responses, and focused backend tests.
- AI contribution: Generated the backend domain, API boundary, parameterized repository query, service, seed generator, problem-detail error handling, tests, and accompanying documentation.
- Candidate review status: Awaiting review and commit approval.
- Explicit exclusion: No React catalog functionality or separate Milestone 3 work was included.

### Candidate review outcome

- Candidate accepted the generated backend and exact Milestone 2 commit message.
- Candidate approved and pushed the commit to `origin/main`.

## Milestone 3 - React catalog UI

- Candidate instruction: Implement the listing page with debounced search, category filtering, pagination, totals, card creation, confirmed deletion, complete UI states, responsive behavior, and useful frontend tests.
- AI contribution: Replaced the connectivity placeholder with a small API client, local React state orchestration, focused components, responsive CSS, and frontend behavior tests.
- AI suggestion: Avoid additional runtime libraries because React hooks and native browser features cover the required interactions clearly.
- Candidate review status: Awaiting review and commit approval.

### Candidate review outcome

- Candidate accepted the generated UI and exact Milestone 3 commit message.
- Candidate approved and pushed the commit to `origin/main`.
- Automated browser control was unavailable; the candidate explicitly deferred the visual browser check to final verification.

## Final verification

- Candidate instruction: Rerun all tests/builds and Compose flows, perform a focused security review, reconcile documentation, scan repository hygiene, fix only meaningful issues, and provide a manual browser checklist.
- AI finding and change: The initial frontend used exact direct dependency versions but lacked a lockfile. The AI generated `package-lock.json`, switched Docker and documented installs from `npm install` to `npm ci`, and recorded the reproducibility decision.
- AI security review scope: The installed skill supplied React/browser guidance. Spring/Java was reviewed manually because that skill has no Java reference pack.
- Candidate review status: Awaiting review and commit approval.

## Interaction polish

- Candidate instruction: Replace text deletion with an accessible inline SVG icon, add reduced-motion-safe creation highlighting and scrolling, retain badges/currency formatting, and verify pending action states without new UI libraries.
- AI contribution: Added the icon control, three-second new-card feedback, conditional scrolling, reduced-motion handling, refined badge/button styles, and focused pending/accessibility/feedback assertions.
- Existing behavior retained: The form and delete controls already disabled themselves while pending, prices already used `Intl.NumberFormat`, and categories already rendered as tags; these were tested and visually refined rather than reimplemented.
- Candidate review status: Awaiting review and commit approval.

## Working principles

- Candidate decisions and AI suggestions are labeled in `DECISIONS.md`.
- No commit is created until the candidate reviews the file list, verification evidence, and exact proposed message.
- Test results and commands are recorded only after they are actually run.
- Any later AI-generated code that the candidate changes or rejects will be noted here.
