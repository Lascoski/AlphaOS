const apiBaseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${apiBaseUrl}${path}`, { ...options, headers });

  if (response.status === 401 && path !== '/api/login') {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
    window.location.assign('/login');
  }

  return response;
}
