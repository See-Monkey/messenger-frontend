import { apiFetch } from "./client.js";

export const register = async (data) => {
	const res = await apiFetch("/auth/register", {
		method: "POST",
		body: JSON.stringify(data),
	});

	if (res.token) {
		localStorage.setItem("token", res.token);
	}

	return res;
};

export const login = async (data) => {
	const res = await apiFetch("/auth/login", {
		method: "POST",
		body: JSON.stringify(data),
	});

	if (res.token) {
		localStorage.setItem("token", res.token);
	}

	return res;
};

export const logout = () => {
	localStorage.removeItem("token");
};
