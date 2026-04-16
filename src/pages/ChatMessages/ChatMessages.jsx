import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import UserSearch from "../../components/UserSearch/UserSearch.jsx";
import Button from "../../components/Button/Button.jsx";
import defualtAvatar from "../../icons/account-circle.svg";
import styles from "./ChatMessages.module.css";
import sendIcon from "../../icons/send.svg";
import {
  getChatById,
  editChat,
  addUserToChat,
  sendMessage,
  leaveChat,
} from "../../api/chats.js";
import formatMessageDate from "../../functions/formatMessageDate.js";
import { useAuth } from "../../context/useAuth.js";
import { useChats } from "../../context/useChats.js";

export default function ChatMessages() {
  const { chatId } = useParams();
  const { user } = useAuth();

  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  const [showUserSearch, setShowUserSearch] = useState(false);

  const navigate = useNavigate();
  const { fetchChats } = useChats();

  const messagesEndRef = useRef(null);

  const otherMembers = chat?.chatMembers
    .filter((m) => m.user.id !== user.id)
    .map((m) => m.user);

  const otherUser = chat?.chatMembers.find((m) => m.user.id !== user.id)?.user;

  const isCustomNamed =
    !chat?.isGroup && chat?.name && chat.name !== otherUser?.displayName;

  useEffect(() => {
    async function load() {
      try {
        const data = await getChatById(chatId);

        setChat(data);
        setMessages([...data.messages].reverse());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function getSender(message) {
    return chat.chatMembers.find((m) => m.user.id === message.senderId)?.user;
  }

  function renderSystemMessage(msg) {
    switch (msg.systemType) {
      case "USER_ADDED":
        return `${msg.meta?.addedBy?.displayName || "Someone"} added ${
          msg.meta?.user?.displayName || "someone"
        }`;

      case "USER_LEFT":
        return `${msg.meta?.user?.displayName || "Someone"} left the chat`;

      case "CHAT_RENAMED":
        return `${msg.meta?.changedBy?.displayName || "Someone"} renamed the chat to "${msg.meta?.newName}"`;

      default:
        return "System event";
    }
  }

  function getChatName() {
    if (!chat) return "";

    if (chat.name) return chat.name;

    if (chat.isGroup) return "Group Chat";

    const other = chat.chatMembers.find((m) => m.user.id !== user.id);
    return other?.user.displayName || other?.user.username;
  }

  async function handleSend(e) {
    e.preventDefault();

    if (!input.trim()) return;

    const tempId = crypto.randomUUID();

    const tempMessage = {
      id: tempId,
      content: input,
      senderId: user.id,
      createdAt: new Date().toISOString(),
      optimistic: true,
    };

    setMessages((prev) => [...prev, tempMessage]);
    setInput("");

    try {
      const real = await sendMessage(chatId, input);

      setMessages((prev) => prev.map((m) => (m.id === tempId ? real : m)));

      await fetchChats();
    } catch (err) {
      console.error(err);

      // rollback
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    }
  }

  async function toggleEdit() {
    const newName = prompt("Enter new chat name:", chat.name || "");

    if (!newName?.trim()) return;

    try {
      await editChat(chat.id, newName);
      const updatedChat = await getChatById(chat.id);

      setChat(updatedChat);
      setMessages([...updatedChat.messages].reverse());

      await fetchChats();
    } catch (err) {
      console.error(err);
    }
  }

  function addMember() {
    setShowUserSearch(true);
  }

  async function handleAddUser(userToAdd) {
    try {
      await addUserToChat(chat.id, userToAdd.id);

      // re-fetch the full chat so state stays in sync
      const updatedChat = await getChatById(chat.id);
      setChat(updatedChat);
      setMessages([...updatedChat.messages].reverse());

      setShowUserSearch(false);

      await fetchChats();
    } catch (err) {
      console.error(err);
    }
  }

  async function leave() {
    const confirmLeave = confirm("Are you sure you want to leave this chat?");
    if (!confirmLeave) return;

    try {
      await leaveChat(chat.id);

      await fetchChats();

      navigate("/");
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!chat) return <div>Chat not found</div>;

  return (
    <section className={styles.chatMessagesSection}>
      <div className={styles.chatHeader}>
        <div className={styles.chatHeaderMembers}>
          <h2>{getChatName()}</h2>
          <div className={styles.chatMembers}>
            {(chat.isGroup || isCustomNamed) &&
              otherMembers?.map((member, index) => (
                <span key={member.id}>
                  {member.displayName}
                  {index < otherMembers.length - 1 ? ", " : ""}
                </span>
              ))}
          </div>
        </div>

        <div className={styles.chatHeaderControls}>
          <Button size="sm" onClick={toggleEdit}>
            Edit Chat Name
          </Button>

          <Button size="sm" onClick={addMember}>
            Add Member
          </Button>

          <Button size="sm" variant="danger" onClick={leave}>
            Leave Chat
          </Button>
        </div>
      </div>

      {showUserSearch && (
        <UserSearch
          selectedUsers={chat.chatMembers.map((m) => m.user)}
          onSelectUser={handleAddUser}
        />
      )}

      <div className={styles.messagesContainer}>
        {messages.map((msg) => {
          if (msg.type === "SYSTEM") {
            return (
              <div className={styles.systemMessage} key={msg.id}>
                <p>{renderSystemMessage(msg)}</p>
                <p className={styles.systemDate}>
                  {formatMessageDate(msg.createdAt)}
                </p>
              </div>
            );
          }

          const sender = getSender(msg);
          const isOwnMessage = msg.senderId === user.id;

          return (
            <div
              key={msg.id}
              className={`${styles.messageContainer} ${
                isOwnMessage ? styles.userMessage : ""
              }`}
            >
              <img
                src={sender?.avatarUrl || defualtAvatar}
                alt="avatar"
                className={styles.avatar}
                style={{ backgroundColor: sender?.themeColor || "#f8f9fa" }}
              />

              <div className={styles.messageContent}>
                <div className={styles.messageContentHeader}>
                  <h3>{sender?.displayName || "Unknown"}</h3>
                  <p className={styles.messageDate}>
                    {formatMessageDate(msg.createdAt)}
                  </p>
                </div>
                <p>{msg.deletedAt ? "Message deleted" : msg.content}</p>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className={styles.messageForm}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />

        <button type="submit">
          <img src={sendIcon} alt="send" />
        </button>
      </form>
    </section>
  );
}
