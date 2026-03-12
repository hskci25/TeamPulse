# TeamPulse MVP — Run Guide

Everything you need to run the MVP locally or verify deployment.

---

## 1. Prerequisites

| Requirement | Version / Notes |
|-------------|-----------------|
| **Node.js** | 18+ (for frontend) |
| **npm** | Comes with Node |
| **Java** | 17+ (for backend) |
| **Maven** | 3.6+ (to build/run backend) |
| **MongoDB** | 6+ (local or Atlas) |

Check:

```bash
node -v    # v18+
java -v    # 17+
mvn -v     # 3.6+
```

---

## 2. MongoDB

### Option A — Local (Docker)

```bash
docker run -d -p 27017:27017 --name teampulse-mongo mongo:7
```

- URI: `mongodb://localhost:27017/teampulse`
- No env var needed (backend default).

### Option B — MongoDB Atlas (free tier)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas), sign up.
2. Create a **free** cluster (e.g. M0).
3. **Database Access** → Add user (username + password). Note the password.
4. **Network Access** → Add IP: `0.0.0.0` (or your IP) so your app can connect.
5. **Database** → Connect → **Drivers** → copy connection string. It looks like:
   ```text
   mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Append database name: add `/teampulse` before `?`:
   ```text
   mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/teampulse?retryWrites=true&w=majority
   ```
7. Set this as `MONGODB_URI` when running the backend.

---

## 3. Backend

### 3.1 Environment variables

| Variable | Required | Default | Description |
|----------|----------|--------|-------------|
| `MONGODB_URI` | No (if local MongoDB) | `mongodb://localhost:27017/teampulse` | MongoDB connection string |
| `PORT` | No | `8080` | Server port |
| `RESEND_API_KEY` | No | — | Resend API key; if missing, **no emails are sent** (app still works) |
| `RESEND_FROM_EMAIL` | No | `TeamPulse <onboarding@resend.dev>` | Sender for emails (Resend default domain or your verified domain) |
| `APP_BASE_URL` | Yes for real vote links | `http://localhost:5173` | Frontend URL; used in email vote links |
| `JWT_SECRET` | Yes in production | (default in app) | Secret for JWT signing; set a long random string in production |

- **Local dev:** Often only `MONGODB_URI` (if not local) and optionally `RESEND_API_KEY`.
- **Production:** Set all of `MONGODB_URI`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `APP_BASE_URL`, `JWT_SECRET`.

**Login:** Creating teams and plans and viewing "My plans" require an account. Users register or log in (email + password); the app uses JWT for auth. Vote links in emails still work without logging in.

### 3.2 Run backend (local)

From repo root:

```bash
cd backend

# Optional: set env (examples)
export MONGODB_URI="mongodb://localhost:27017/teampulse"
export APP_BASE_URL="http://localhost:5173"
# export RESEND_API_KEY="re_xxxxxxxx"

mvn spring-boot:run
```

- Backend: **http://localhost:8080**
- Health: open **http://localhost:8080/api/teams** (should return `[]` or 200).

### 3.3 Build JAR (for deploy / Run without Maven)

```bash
cd backend
mvn -DskipTests package
java -jar target/teampulse-backend-0.0.1-SNAPSHOT.jar
```

Same env vars; can pass on command line:

```bash
MONGODB_URI="mongodb+srv://..." APP_BASE_URL="https://your-frontend.com" java -jar target/teampulse-backend-0.0.1-SNAPSHOT.jar
```

---

## 4. Frontend

### 4.1 Install and run (local)

From repo root:

```bash
cd frontend
npm install
npm run dev
```

- App: **http://localhost:5173**
- Vite proxies `/api` to `http://localhost:8080`, so the app talks to your local backend.

### 4.2 Build for production

```bash
cd frontend
npm run build
```

Static files in `frontend/dist/`. Serve with any static host (e.g. Render, Vercel, nginx).  
For production, set backend `APP_BASE_URL` to this frontend URL so email vote links point to the right place.

---

## 5. Resend (optional — for real emails)

Without `RESEND_API_KEY`, team/plan creation and voting work; only email sending is skipped.

1. Sign up: [resend.com](https://resend.com).
2. **API Keys** → Create → copy key (starts with `re_`).
3. **Domains**: either use **onboarding@resend.dev** (testing, limited) or add your domain and use e.g. `TeamPulse <noreply@yourdomain.com>` in `RESEND_FROM_EMAIL`.
4. Set when running backend:
   ```bash
   export RESEND_API_KEY="re_xxxxxxxx"
   export RESEND_FROM_EMAIL="TeamPulse <onboarding@resend.dev>"   # or your domain
   ```

### 5.1 Reducing spam (emails landing in inbox)

- **Verify a domain** in Resend (Dashboard → Domains → Add). Use that domain in `RESEND_FROM_EMAIL` (e.g. `TeamPulse <noreply@yourdomain.com>`). Mail from a verified domain is much less likely to go to spam.
- The app sends both **HTML and plain-text** parts; that improves deliverability.
- With the default `onboarding@resend.dev`, many providers may still treat mail as less trusted; for production, use your own verified domain.

### 5.2 Calendar invites

- When a plan is **confirmed** (voting closed, at least one vote), every team member gets an email with a **calendar invite** attached (`invite.ics`).
- The invite is sent as **METHOD:REQUEST** with the recipient as **ATTENDEE**, so Gmail/Outlook/Apple Mail often show **“Add to calendar”** or **Accept/Decline**.
- Add the event from your mail client (e.g. open the email and use “Add to calendar” or accept the invite).

---

## 6. End-to-end test (MVP flow)

### 6.1 Start everything

1. MongoDB running (local or Atlas).
2. Backend: `cd backend && mvn spring-boot:run` (env vars set if needed).
3. Frontend: `cd frontend && npm run dev`.

### 6.2 Create a team

1. Open **http://localhost:5173** → **Create a team**.
2. Fill:
   - Team name: e.g. `Test Squad`
   - Member emails: 2–3 real addresses (to receive emails if Resend is set).
3. Submit → redirect to team page. Note the **team ID** in the URL (e.g. `http://localhost:5173/teams/674abc123...`).

### 6.3 Create a plan

1. From team page click **Create a plan**, or go to **Create a plan** and paste the team ID.
2. Fill:
   - Plan title: e.g. `Friday Lunch`
   - Activity date/time: any future time.
   - Voting deadline: e.g. tomorrow 6 PM (must be in the future).
   - Options: at least 2 (e.g. `Thai`, `Italian`).
3. Submit → redirect to plan detail. Note **plan ID** in URL.

### 6.4 Vote (anonymous)

- Each member gets a **unique link** by email (if Resend is set). Link format:
  `http://localhost:5173/vote/<planId>?token=<uuid>`
- Without email: get a token from backend DB (collection `voter_tokens`, field `token` for that `planId`), or add a temporary “copy vote link” on plan page for testing.
- Open link → choose option → **Submit vote**. Participation count updates (and on plan detail after refresh).

### 6.5 After deadline

- Backend runs a job every **5 minutes** and closes plans whose `deadline` has passed.
- If **≥ 70%** of members voted: status → **CONFIRMED**, winner = option with most votes, result email + **calendar invite (.ics)** sent.
- If **< 70%**: status → **CANCELLED**, cancellation email sent.

To test quickly, create a plan with deadline **1–2 minutes** in the future and wait, or temporarily change the scheduler interval in code.

---

## 7. API quick reference

Base URL (local): **http://localhost:8080**

| Method | Endpoint | Body (JSON) |
|--------|----------|-------------|
| POST | `/api/teams` | `{ "name": "My Team", "memberEmails": ["a@x.com","b@x.com"], "city": "Mumbai", "createdBy": "a@x.com" }` |
| GET | `/api/teams/:teamId` | — |
| GET | `/api/teams/:teamId/members` | — |
| POST | `/api/plans` | `{ "teamId": "<id>", "title": "Friday Lunch", "dateTime": "2025-03-15T13:00:00Z", "deadline": "2025-03-14T18:00:00Z", "options": [{"name":"Thai","category":"FOOD"},{"name":"Italian","category":"FOOD"}] }` |
| GET | `/api/plans/:planId` | — |
| GET | `/api/plans/:planId/vote?token=...` | — |
| GET | `/api/plans/team/:teamId` | — |
| POST | `/api/vote/:planId?token=...` | `{ "optionId": "<option-uuid>" }` |
| GET | `/api/vote/:planId/count` | — |

All times in ISO 8601 (e.g. `2025-03-14T18:00:00.000Z`).

---

## 8. Troubleshooting

| Issue | Check |
|-------|--------|
| Backend won’t start | Java 17+, `MONGODB_URI` correct, MongoDB reachable (e.g. `mongosh` or Atlas connection test). |
| Frontend “Failed to fetch” / network error | Backend running on 8080; frontend uses proxy only in dev (Vite). For production, frontend must call backend URL (e.g. env `VITE_API_URL`). |
| No emails | `RESEND_API_KEY` set and valid; from-address allowed (Resend default or verified domain). Check Resend dashboard for logs. |
| Vote link 404 / invalid | Frontend route is `/vote/:planId`; link must include `?token=...`. `APP_BASE_URL` must match how users open the app (e.g. `http://localhost:5173` in dev). |
| Plan never confirms | Deadline must be in the past; scheduler runs every 5 min; ≥ 70% of **members** must have voted (count members on team, not options). |

---

## 9. One-command summary (local, default MongoDB)

```bash
# Terminal 1 — MongoDB (if Docker)
docker run -d -p 27017:27017 --name teampulse-mongo mongo:7

# Terminal 2 — Backend
cd backend && mvn spring-boot:run

# Terminal 3 — Frontend
cd frontend && npm install && npm run dev
```

Then open **http://localhost:5173** and create a team → create a plan → use email vote links (or DB token) to vote.
