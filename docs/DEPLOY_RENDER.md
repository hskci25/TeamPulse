# Deploying TeamPulse on Render.com

---

## Step-by-step: Deploy backend on Render

### Step 1: Push your code to GitHub

- Commit and push your TeamPulse repo (including the `backend/` folder and `backend/Dockerfile`) to GitHub so Render can access it.

### Step 2: Sign in to Render

- Go to [render.com](https://render.com) and sign in (or sign up with GitHub).

### Step 3: Create a new Web Service

1. From the **Dashboard**, click **New +** → **Web Service**.
2. Connect your **GitHub** account if needed, then select the **TeamPulse** repository.
3. Click **Connect**.

### Step 4: Configure the service

1. **Name:** e.g. `teampulse-backend`.
2. **Region:** Choose the one closest to you or your users.
3. **Branch:** e.g. `main` (or the branch you deploy from).
4. **Root Directory:** Enter `backend`.  
   (Render will run Docker from this folder where the Dockerfile is.)
5. **Runtime:** Select **Docker**.
6. **Instance type:** Free or paid (Free is fine for testing).

Do **not** set a build or start command; Render uses the Dockerfile.

### Step 5: Add environment variables

Click **Advanced** → **Add Environment Variable**, then add these (replace with your real values):

| Key | Value | Notes |
|-----|--------|--------|
| `MONGODB_URI` | `mongodb+srv://USER:PASSWORD@cluster.xxx.mongodb.net/teampulse?retryWrites=true&w=majority` | From MongoDB Atlas: Database → Connect → Drivers. Use your user, password, and cluster URL. Encode `@` in password as `%40` if needed. |
| `APP_BASE_URL` | `https://your-frontend.onrender.com` | Your frontend URL (where the app is served). Use your real frontend URL once deployed; you can change this later. |
| `JWT_SECRET` | Long random string (e.g. 32+ characters) | Generate a strong secret (e.g. `openssl rand -base64 32`). Or in Render you can use **Generate** for a secret. |
| `RESEND_API_KEY` | `re_xxxxxxxx` | Optional. From [resend.com](https://resend.com) → API Keys. Leave blank if you don’t need emails yet. |
| `RESEND_FROM_EMAIL` | `TeamPulse <onboarding@resend.dev>` | Optional. Sender for emails. |

**Do not** set `PORT`; Render sets it automatically.

### Step 6: Deploy

1. Click **Create Web Service**.
2. Render will clone the repo, run `docker build` in the `backend/` directory, and start the container.
3. Wait for the build and deploy to finish (first time can take a few minutes).
4. When the status is **Live**, your backend URL will be shown at the top (e.g. `https://teampulse-backend.onrender.com`).

### Step 7: Verify

- Open the backend URL in a browser (e.g. `https://teampulse-backend.onrender.com`). You may see a Whitelabel error page or 404; that’s normal if you have no root mapping.
- Test the API:  
  `https://teampulse-backend.onrender.com/api/teams`  
  You should get `[]` or `401 Unauthorized` (because listing teams requires login). Both indicate the app is running.
- If the service fails to start, open the **Logs** tab on Render and fix any errors (often a missing or wrong env var, e.g. `MONGODB_URI`).

### Step 8: Point the frontend to the backend

When you deploy the frontend (e.g. as a Static Site on Render), set this env var for the frontend:

- **Key:** `VITE_API_URL`  
- **Value:** Your backend URL, e.g. `https://teampulse-backend.onrender.com`  
  (no trailing slash)

Redeploy the frontend after adding this so API calls go to your deployed backend.

---

## Backend (Java / Spring Boot) — reference

### 1. Create a Web Service

- **Repository:** Connect your Git repo.
- **Environment:** **Docker**.
- **Root Directory:** `backend` (so Render runs `docker build` in `backend/` where the Dockerfile lives).
- **Instance type:** Free or paid.

### 2. Environment Variables

Set these in the Render dashboard under **Environment** (or in `render.yaml` as `envVars`). **Do not commit real values to Git.**

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | Full MongoDB connection string (e.g. Atlas: `mongodb+srv://user:pass@cluster.mongodb.net/teampulse?retryWrites=true&w=majority`) |
| `PORT` | No | Render sets this automatically (e.g. `10000`). Default in app: `8080`. |
| `RESEND_API_KEY` | No | Resend API key for emails. If empty, app runs but does not send emails. |
| `RESEND_FROM_EMAIL` | No | Sender address, e.g. `TeamPulse <noreply@yourdomain.com>`. |
| `APP_BASE_URL` | Yes | Frontend URL for vote links, e.g. `https://your-frontend.onrender.com`. |
| `JWT_SECRET` | Yes (prod) | Long random string for JWT signing (e.g. 32+ chars). Use a strong secret in production. |
| `JWT_VALIDITY_MS` | No | Token lifetime in ms (default `604800000` = 7 days). |

### 3. Build and Run

- **Dockerfile path:** `backend/Dockerfile` (with root directory `backend`, the build context is `backend/`).
- Render will run `docker build` and then start the container. The Dockerfile exposes `PORT` and the app reads `server.port` from the `PORT` env var.

### 4. Health Check

- Render’s default health check is HTTP on the service URL. Your app listens on `PORT`, so no extra config is needed unless you add a dedicated health endpoint.

---

## Frontend (Static Site or Web Service)

Deploy the frontend separately (e.g. **Static Site** on Render, or Vercel/Netlify).

1. **Build command:** `cd frontend && npm ci && npm run build`
2. **Publish directory:** `frontend/dist`
3. **Environment:** Set `VITE_API_URL` to your backend URL (e.g. `https://teampulse-api.onrender.com`). The frontend uses this for all API calls in production. (Dev uses relative `/api` with Vite proxy.)

---

## Summary

- **Secrets:** All secrets are read from environment variables; `application.yml` only references them (e.g. `${MONGODB_URI}`). Set values in Render’s Environment tab.
- **Backend:** Docker build from `backend/Dockerfile`; set `MONGODB_URI`, `APP_BASE_URL`, `JWT_SECRET`, and optionally Resend and JWT validity.
- **Frontend:** Point API base URL to the deployed backend and set `APP_BASE_URL` on the backend to the frontend URL so email vote links work.
