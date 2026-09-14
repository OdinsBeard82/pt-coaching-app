const BASE = '/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, { method = 'GET', body, isForm = false } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isForm && body) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no body
  }

  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  signup: (body) => request('/auth/signup', { method: 'POST', body }),
  login: (body) => request('/auth/login', { method: 'POST', body }),
  me: () => request('/auth/me'),

  myProgram: () => request('/programs/mine/current'),
  getProgram: (id) => request(`/programs/${id}`),

  listPrograms: () => request('/programs'),
  createProgram: (body) => request('/programs', { method: 'POST', body }),
  updateProgram: (id, body) => request(`/programs/${id}`, { method: 'PUT', body }),
  deleteProgram: (id) => request(`/programs/${id}`, { method: 'DELETE' }),

  listClients: () => request('/clients'),
  getClient: (id) => request(`/clients/${id}`),
  assignProgram: (clientId, program_id) =>
    request(`/clients/${clientId}/assign-program`, { method: 'PUT', body: { program_id } }),

  myCheckins: () => request('/checkins/mine'),
  submitCheckin: (formData) => request('/checkins', { method: 'POST', body: formData, isForm: true }),
  recentCheckins: () => request('/checkins/recent'),
  giveFeedback: (id, coach_feedback) =>
    request(`/checkins/${id}/feedback`, { method: 'PUT', body: { coach_feedback } }),

  createCheckoutSession: (tier) =>
    request('/stripe/create-checkout-session', { method: 'POST', body: { tier } }),
  createPortalSession: () => request('/stripe/create-portal-session', { method: 'POST' }),
};