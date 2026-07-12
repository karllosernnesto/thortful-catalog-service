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

## Working principles

- Candidate decisions and AI suggestions are labeled in `DECISIONS.md`.
- No commit is created until the candidate reviews the file list, verification evidence, and exact proposed message.
- Test results and commands are recorded only after they are actually run.
- Any later AI-generated code that the candidate changes or rejects will be noted here.
