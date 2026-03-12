# What’s Required to Run the MVP (and How to Get It)

You already have **MongoDB** (Atlas URI in `application.yml`). Here’s everything else.

---

## 1. Required: Run the apps

### Java 17+

- **Why:** Backend is Spring Boot (Java).
- **Check:** `java -version` (must show 17 or higher).
- **Get it:**
  - **macOS:** `brew install openjdk@17` then link, or install from [Adoptium](https://adoptium.net/).
  - **Windows:** [Adoptium](https://adoptium.net/) or Oracle JDK 17.
  - **Linux:** `sudo apt install openjdk-17-jdk` (Debian/Ubuntu) or equivalent.

### Maven

- **Why:** Build and run the backend.
- **Check:** `mvn -v`.
- **Get it:**
  - **macOS:** `brew install maven`
  - **Windows:** [maven.apache.org/download](https://maven.apache.org/download.cgi), extract, add `bin` to PATH.
  - **Linux:** `sudo apt install maven` (Debian/Ubuntu).

### Node.js 18+ and npm

- **Why:** Frontend is React (Vite).
- **Check:** `node -v` and `npm -v`.
- **Get it:**
  - **All:** [nodejs.org](https://nodejs.org/) (LTS). npm is included.

---

## 2. Optional but recommended: Send real emails (Resend)

Without a Resend API key, the app still runs: create team, create plan, vote. **No emails are sent** (welcome, vote links, result emails).

### Resend API key

- **Why:** Sends welcome emails, vote links, and result + calendar emails.
- **Get it:**
  1. Go to [resend.com](https://resend.com) and sign up.
  2. In the dashboard: **API Keys** → **Create API Key** → name it (e.g. “TeamPulse”), copy the key (starts with `re_`).
  3. Set it when running the backend:
     ```bash
     export RESEND_API_KEY="re_xxxxxxxxxxxxxxxx"
     mvn spring-boot:run
     ```
     Or add to `application.yml` under `resend.api-key` (avoid committing that file if it contains the key).

### Sender email (optional)

- **Default:** `TeamPulse <onboarding@resend.dev>` (Resend’s test domain; limited).
- **Your domain:** In Resend, add your domain (e.g. `yourdomain.com`), verify DNS, then set:
  ```bash
  export RESEND_FROM_EMAIL="TeamPulse <noreply@yourdomain.com>"
  ```
  Or set `resend.from-email` in config.

---

## 3. Optional: Override defaults

| What            | Default                     | When to change                          |
|-----------------|-----------------------------|-----------------------------------------|
| **Backend port**| `8080`                      | If 8080 is in use: `export PORT=8081`   |
| **App base URL**| `http://localhost:5173`     | For production: your frontend URL (e.g. `https://yourapp.com`) so email vote links are correct. |

---

## 4. Quick checklist

| Item              | Required? | You have it? | How to get it                    |
|-------------------|-----------|--------------|-----------------------------------|
| MongoDB URI       | Yes       | Yes (in yml) | Already in `application.yml`     |
| Java 17+          | Yes       | —            | Adoptium / brew / apt             |
| Maven             | Yes       | —            | brew / apt / maven.apache.org    |
| Node 18+ & npm    | Yes       | —            | nodejs.org                       |
| Resend API key    | No        | —            | resend.com → API Keys → Create   |
| Resend from email | No        | —            | Default OK; or add domain in Resend |

---

## 5. Run after you have the above

```bash
# Terminal 1 — backend
cd backend
# Optional: export RESEND_API_KEY="re_xxx"
mvn spring-boot:run

# Terminal 2 — frontend
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** → Create a team → Create a plan → Use the vote link (from email if Resend is set, or from DB for testing).
