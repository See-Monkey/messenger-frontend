import { apiFetch } from "./client.js";

// Edit message
export const editMessage = (messageId, content) =>
	apiFetch(`/messages/${messageId}`, {
		method: "PATCH",
		body: JSON.stringify({ content }),
	});

// Delete message
export const deleteMessage = (messageId) =>
	apiFetch(`/messages/${messageId}`, {
		method: "DELETE",
	});
