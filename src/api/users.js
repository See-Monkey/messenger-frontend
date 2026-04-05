import { apiFetch } from "./client.js";

// Get account details
export async function getMe() {
  try {
    return await apiFetch("/users/me");
  } catch (err) {
    if (err.message === "Unauthorized") {
      return null;
    }
    throw err;
  }
}

// Update account details
export const updateMe = (data) =>
  apiFetch("/users/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const changeMyPassword = (data) =>
  apiFetch("/users/me/password", {
    method: "PATCH",
    body: JSON.stringify(data),
  });

// Delete account
export const deleteMe = () =>
  apiFetch("/users/me", {
    method: "DELETE",
  });

// Search users
export const searchUsers = (query, limit = 15) => {
  if (!query?.trim()) return Promise.resolve([]);

  return apiFetch(`/users?search=${encodeURIComponent(query)}&limit=${limit}`);
};

// Get public profile
export const getPublicProfile = (userId) => apiFetch(`/users/${userId}`);
