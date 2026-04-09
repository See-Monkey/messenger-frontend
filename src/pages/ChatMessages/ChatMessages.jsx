import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import UserSearch from "../../components/UserSearch/UserSearch.jsx";
import Button from "../../components/Button/Button.jsx";
import styles from "./ChatMessages.module.css";
import sendIcon from "../../icons/send.svg";
import {
  getChatById,
  editChat,
  addUserToChat,
  sendMessage,
  leaveChat,
} from "../../api/chats.js";
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

  function getSender(message) {
    return chat.chatMembers.find((m) => m.user.id === message.senderId)?.user;
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
      const updated = await editChat(chat.id, newName);

      setChat((prev) => ({
        ...prev,
        name: updated.name,
      }));

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
          const sender = getSender(msg);

          return (
            <div key={msg.id} className={styles.messageContainer}>
              <p>{sender?.displayName || "Unknown"}</p>

              <p>{msg.deletedAt ? "Message deleted" : msg.content}</p>
            </div>
          );
        })}
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
