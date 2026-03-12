# TeamPulse

Team activity planning without the "what are we doing Friday?" chaos. Set up once, vote anonymously, get a plan — automatically.

## Phase 1 MVP

- Create team + add member emails → welcome emails sent
- Create plan + options + deadline → vote links emailed to all members
- Anonymous voting page (unique link per person)
- Live participation counter
- At deadline: 70%+ votes → CONFIRMED + result email + calendar invite (.ics); else CANCELLED

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Java 17 + Spring Boot 3 + MongoDB
- **Email:** Resend API (optional; logs only if no key)
- **Cron:** Spring `@Scheduled` every 5 min for deadline processing

## Quick Start

### 1. MongoDB

Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier) or run locally:

```bash
# optional: local MongoDB
docker run -d -p 27017:27017 mongo:7
```

Set `MONGODB_URI` if not using `mongodb://localhost:27017/teampulse`.

### 2. Backend

```bash
cd backend
export MONGODB_URI="mongodb://localhost:27017/teampulse"   # or your Atlas URI
export RESEND_API_KEY="re_xxx"                            # optional, for real emails
export APP_BASE_URL="http://localhost:5173"              # frontend URL for vote links
mvn spring-boot:run
```

API: http://localhost:8080

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173 (proxies `/api` to backend).

### 4. Optional: Resend

- Sign up at [resend.com](https://resend.com), get an API key.
- Set `RESEND_API_KEY` and (if using your domain) `RESEND_FROM_EMAIL`.
- Without it, team creation and plan creation still work; emails are skipped.

## Environment (Backend)

| Variable         | Description                          | Default                    |
|------------------|--------------------------------------|----------------------------|
| `MONGODB_URI`     | MongoDB connection string            | `mongodb://localhost:27017/teampulse` |
| `PORT`            | Server port                           | `8080`                     |
| `RESEND_API_KEY`  | Resend API key (optional)             | —                          |
| `RESEND_FROM_EMAIL` | Sender email (e.g. `TeamPulse <noreply@yourdomain.com>`) | `TeamPulse <onboarding@resend.dev>` |
| `APP_BASE_URL`    | Frontend base URL for vote links      | `http://localhost:5173`    |

## API Summary

- `POST /api/teams` — create team (body: name, city?, budgetMin?, budgetMax?, memberEmails, createdBy?)
- `GET /api/teams/:teamId` — get team
- `GET /api/teams/:teamId/members` — list members
- `POST /api/plans` — create plan (body: teamId, title, dateTime, deadline, createdBy?, options[])
- `GET /api/plans/:planId` — get plan (with vote counts)
- `GET /api/plans/:planId/vote?token=...` — get plan for voting (validates token)
- `GET /api/plans/team/:teamId` — list plans for team
- `POST /api/vote/:planId?token=...` — cast vote (body: optionId)
- `GET /api/vote/:planId/count` — participation count

## Deploy (Render)

- **Backend:** Build with `mvn -DskipTests package`, run `java -jar target/teampulse-backend-*.jar`. Set env vars in Render dashboard.
- **Frontend:** Build with `npm run build`, serve `dist/` (static). Set `APP_BASE_URL` to your frontend URL.
- **Cron:** The app runs its own scheduler; no separate Vercel cron needed for Phase 1.
