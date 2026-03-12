const API_BASE = import.meta.env.VITE_API_URL || '';
const API = API_BASE + '/api';

function authHeaders() {
  const token = typeof window !== 'undefined' && localStorage.getItem('teampulse_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function register(email, password) {
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || await res.text() || res.statusText);
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || await res.text() || res.statusText);
  return res.json();
}

export async function createTeam(data) {
  const res = await fetch(`${API}/teams`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || res.statusText);
  return res.json();
}

/** Get teams the current user is a member of. Requires auth. */
export async function getTeams() {
  const res = await fetch(`${API}/teams`, { headers: authHeaders() });
  if (!res.ok) throw new Error(await res.text() || res.statusText);
  return res.json();
}

export async function getTeam(teamId) {
  const res = await fetch(`${API}/teams/${teamId}`, { headers: authHeaders() });
  if (!res.ok) throw new Error(await res.text() || res.statusText);
  return res.json();
}

export async function getMembers(teamId) {
  const res = await fetch(`${API}/teams/${teamId}/members`);
  if (!res.ok) throw new Error(await res.text() || res.statusText);
  return res.json();
}

export async function createPlan(data) {
  const res = await fetch(`${API}/plans`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || res.statusText);
  return res.json();
}

export async function getPlan(planId) {
  const res = await fetch(`${API}/plans/${planId}`);
  if (!res.ok) throw new Error(await res.text() || res.statusText);
  return res.json();
}

export async function getPlanForVote(planId, token) {
  const res = await fetch(`${API}/plans/${planId}/vote?token=${encodeURIComponent(token)}`);
  if (!res.ok) throw new Error(await res.text() || res.statusText);
  return res.json();
}

export async function getPlansByTeam(teamId) {
  const res = await fetch(`${API}/plans/team/${teamId}`, { headers: authHeaders() });
  if (!res.ok) throw new Error(await res.text() || res.statusText);
  return res.json();
}

/** Plans the current user is part of (all teams). Requires auth. */
export async function getMyPlans() {
  const res = await fetch(`${API}/plans/me`, { headers: authHeaders() });
  if (!res.ok) throw new Error(await res.text() || res.statusText);
  return res.json();
}

export async function castVote(planId, token, optionId) {
  const res = await fetch(`${API}/vote/${planId}?token=${encodeURIComponent(token)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ optionId }),
  });
  if (!res.ok) throw new Error((await res.json()).message || res.statusText);
  return res.json();
}

export async function getVoteCount(planId) {
  const res = await fetch(`${API}/vote/${planId}/count`);
  if (!res.ok) throw new Error(await res.text() || res.statusText);
  return res.json();
}
