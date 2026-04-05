const API_BASE = "http://localhost:3000/api";

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    const message =
      error?.message ||
      error?.errors?.[0]?.msg ||
      JSON.stringify(error) ||
      "API request failed";
    throw new Error(message);
  }

  // DELETE returns 204
  if (res.status === 204) return null;

  return res.json();
}
