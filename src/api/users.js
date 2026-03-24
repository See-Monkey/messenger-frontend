import { apiFetch } from "./client.js";

// Get account details
export const getMe = () => apiFetch("/users/me");

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

// Get public profile
export const getPublicProfile = (userId) => apiFetch(`/users/${userId}`);

// Admin delete user
export const deleteAccount = () =>
	apiFetch("/users/me", {
		method: "DELETE",
	});
