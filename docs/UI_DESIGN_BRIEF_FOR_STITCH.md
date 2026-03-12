# TeamPulse — UI Design Brief for Stitch

Use this doc to design the UI. It describes the product, every screen, and what each screen must show.

---

## 1. Product in one sentence

**TeamPulse** is a team activity planning tool: you create a team once, then create plans (e.g. “Friday Lunch”) with options; members get a unique email link, vote anonymously, and the app picks a winner and sends a calendar invite — no WhatsApp threads.

---

## 2. Who uses it

- **Organiser:** Creates the team, adds member emails, creates plans.
- **Member:** Receives email with a vote link, opens it, picks one option (anonymous). No signup.

Design for **web, mobile-first**. Vote page is often opened from email on phone.

---

## 3. Design direction

- **Clean, minimal, trustworthy.** No playful/cartoon; more “small product people actually use.”
- **Low friction:** Short forms, clear CTAs, obvious next step.
- **Anonymous voting:** The vote screen should feel neutral and private (no “who voted”).
- **Status clarity:** Plans can be PENDING (voting open), CONFIRMED (winner chosen), or CANCELLED (not enough votes). These should be visually distinct (e.g. badges or labels).

---

## 4. Global shell (all pages except when noted)

- **Header:** Sticky top. Left: logo + “TeamPulse”. Right: links “New team” and “New plan”.
- **Main content:** Centred, max-width ~640–768px for forms/lists; hero can be wider.
- **Background:** Light neutral (e.g. light grey/slate), content on white or light cards where it helps.

---

## 5. Screens to design

### 5.1 Home (Landing)

- **URL:** `/`
- **Purpose:** Explain the product and send user to “Create team” or “Create plan”.
- **Content:**
  - Headline (e.g. “No more ‘what are we doing Friday?’”).
  - Short subline: set up team once, vote anonymously, get a plan automatically.
  - Two primary actions: **Create a team** (primary button), **Create a plan** (secondary/outline).
  - Small note: “Vote via the link in your email — no signup needed.”
- **No form.** Just headline + 2 buttons + footnote.

---

### 5.2 Create team

- **URL:** `/teams/new`
- **Purpose:** One-time setup of a team. Submitting creates the team and sends welcome emails to all members.
- **Content (form):**
  - **Team name** (required). Placeholder: e.g. “Design Team”.
  - **City** (optional). Placeholder: e.g. “Mumbai”.
  - **Member emails** (required). Textarea; hint: “One per line or comma-separated”.
  - **Organiser email** (optional). Placeholder: e.g. “organiser@example.com”.
  - **Submit button:** “Create team”.
  - **Error message** area (e.g. red text) if validation or API fails.
  - **Link:** “← Back home” below the form.
- **States:** Default, loading (button disabled “Creating…”), error (message above button).

---

### 5.3 Team detail

- **URL:** `/teams/:teamId` (e.g. `/teams/abc123`)
- **Purpose:** Show one team and its plans; allow creating a new plan for this team.
- **Content:**
  - **Success banner** (only right after create): “Team created. Welcome emails have been sent to all members.” (green/success style.)
  - **Team name** (large heading).
  - **Team city** (optional, below name).
  - **Actions:** “Create a plan” (primary), “← Home” (secondary).
  - **Section “Plans”** (heading).
  - **Plans list:** Each row/card is one plan: **title**, **status** (PENDING / CONFIRMED / CANCELLED), and “X/Y voted” when applicable. Row is clickable → plan detail.
  - **Empty state:** If no plans: “No plans yet. Create one above.”
- **States:** Loading (full-page or skeleton), error (“Team not found” + link home), success banner (dismissable or static).

---

### 5.4 Create plan

- **URL:** `/plans/new` (optional query: `?teamId=xxx` to preselect team)
- **Purpose:** Create a voting plan for a team. Submitting sends vote links to all members.
- **Content (form):**
  - **Your email** (required). Hint: “We only show teams you’re a member of.”
  - **Team** (required). Dropdown populated after user enters email; options = “Team name (City)”. Placeholder when no email: “Enter your email above”. When loading: “Loading…”.
  - **Plan title** (required). Placeholder: e.g. “Friday Lunch”.
  - **Activity date & time** (optional). Datetime picker.
  - **Voting deadline** (required). Datetime picker (e.g. default tomorrow 6 PM).
  - **Options** (at least 2). For each: “Option name” text input, “Category” text input (e.g. FOOD), and remove (×) if more than 2. Button “+ Add” to add another option.
  - **Submit button:** “Create plan”.
  - **Error message** area.
  - **Link:** “← Back home”.
- **Empty state for team dropdown:** After email entered but no teams: “You’re not in any teams yet … Create a team first.” (with link to create team).
- **States:** Default, loading teams (dropdown disabled), submitting (button “Creating…”), error.

---

### 5.5 Plan detail

- **URL:** `/plans/:planId`
- **Purpose:** Show plan title, status, deadline, options with vote counts, and winner when confirmed.
- **Content:**
  - **Plan title** (heading).
  - **Status** (badge or label): PENDING | CONFIRMED | CANCELLED.
  - **Meta:** “X/Y voted” and “Deadline: [date/time]”.
  - **Section “Options”:** List of options. Each row: **option name**, **vote count** (e.g. “3 votes”), and if this option won: **“✓ Winner”** (emphasised).
  - **Note** (when PENDING): “Members vote via their email link. Results and calendar invite are sent when the deadline passes (if 70%+ vote).”
  - **Link:** “← Home”.
- **States:** Loading, error (“Plan not found” + home), live (vote count can refresh periodically).

---

### 5.6 Vote (anonymous voting page)

- **URL:** `/vote/:planId?token=xxx` (token from email; user must not have to type it)
- **Purpose:** Let a member pick one option anonymously. Often opened from email on phone.
- **Content:**
  - **Plan title** (heading).
  - **Participation:** “X of Y members have voted” (can update in background).
  - **Deadline:** “Vote by: [date/time]”.
  - **Success message** (after submit): “Your vote was recorded. You can change it until the deadline.” (green/success.)
  - **When voting is open (PENDING):**
    - Subheading: “Choose one option (anonymous)”.
    - List of **radio cards:** each option = radio + option name + optional category label. One selected, then **Submit vote** button.
    - **Error message** if submit fails.
  - **When voting is closed (CONFIRMED or CANCELLED):**
    - Message: either “This plan is confirmed. Check your email for the result and calendar invite.” or “Voting has ended for this plan.”
    - If CONFIRMED: show **Winner: [option name]**.
- **States:** Loading, invalid/missing token (“Invalid or expired link” / “Missing vote link”), success after vote, closed state (no form, just message + winner if any).

---

## 6. User flows (for reference)

1. **Create team:** Home → Create team → fill form → submit → Team detail (with success banner).
2. **Create plan (from team page):** Team detail → “Create a plan” → Create plan (team preselected) → fill form → submit → Plan detail.
3. **Create plan (from nav):** Header “New plan” → Create plan → enter email → pick team → fill form → submit → Plan detail.
4. **Vote:** Member gets email → clicks link → Vote page → pick option → Submit vote → success message; can change vote until deadline.

---

## 7. UI elements to define

- **Buttons:** Primary (e.g. filled indigo), secondary (outline or ghost), disabled state.
- **Form fields:** Text input, textarea, select/dropdown, datetime-local (or equivalent). Labels, placeholders, error state, hint text.
- **Cards/rows:** For plan list items and option rows; hover and selected (e.g. selected vote option) state.
- **Badges/labels:** PENDING (e.g. amber), CONFIRMED (e.g. green), CANCELLED (e.g. grey).
- **Alerts:** Success (green), error (red). Used for banners and inline messages.
- **Header:** Logo, app name, nav links. Sticky behaviour.
- **Loading:** Full-page or inline (e.g. spinner or skeleton for lists/dropdowns).
- **Empty states:** No teams, no plans. Short copy + CTA where relevant.

---

## 8. Technical notes for implementation

- **Stack:** React, Tailwind CSS. No heavy component library required.
- **Responsive:** Mobile-first; breakpoints for tablet/desktop (e.g. 640px, 768px).
- **No auth UI:** No login/signup screens. Identity is “your email” on Create plan and in emails.
- **Vote page:** Must work well on small screens (single column, large tap targets for options and button).

---

## 9. What to deliver (for Stitch)

- **Figma/design file** (or equivalent) with:
  - Global shell (header + sample content area).
  - All 6 screens in default state.
  - Key states: loading, error, success, empty list, vote submitted, plan confirmed/cancelled.
- **Specs or tokens:** Colors, type scale, spacing, radius, shadows for buttons/cards so we can match in Tailwind.
- **Optional:** Light and dark variant if you want to propose both.

If you need more detail on any screen or state, we can add a short “Screen X – states” subsection.
