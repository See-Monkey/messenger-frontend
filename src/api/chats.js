import { apiFetch } from "./client.js";

// Get chats (paginated)
export const getChats = async (cursor, limit = 20) => {
  const params = new URLSearchParams();

  if (cursor) params.append("cursor", cursor);
  if (limit) params.append("limit", limit);

  const res = await apiFetch(`/chats?${params.toString()}`);

  return {
    chats: res.data,
    nextCursor: res.nextCursor,
  };
};

// Create chat
export const createChat = ({ userIds = [], name }) =>
  apiFetch("/chats", {
    method: "POST",
    body: JSON.stringify({ userIds, name }),
  });

// Get single chat (with messages pagination)
export const getChatById = (chatId, cursor, limit = 50) => {
  const params = new URLSearchParams();

  if (cursor) params.append("cursor", cursor);
  if (limit) params.append("limit", limit);

  return apiFetch(`/chats/${chatId}?${params.toString()}`);
};

// Rename chat
export const editChat = (chatId, name) =>
  apiFetch(`/chats/${chatId}`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });

// Add user to chat
export const addUserToChat = (chatId, userId) =>
  apiFetch(`/chats/${chatId}/users`, {
    method: "POST",
    body: JSON.stringify({ userId }),
  });

// Leave chat
export const leaveChat = (chatId) =>
  apiFetch(`/chats/${chatId}/users/me`, {
    method: "DELETE",
  });

// Send message
export const sendMessage = (chatId, content) => {
  if (!content?.trim())
    return Promise.reject(new Error("Message cannot be empty"));

  return apiFetch(`/chats/${chatId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
};
