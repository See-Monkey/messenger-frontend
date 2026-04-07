import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Button from "../../components/Button/Button.jsx";
import styles from "./ChatMessages.module.css";
import sendIcon from "../../icons/send.svg";
import { getChatById } from "../../api/chats.js";
import { sendMessage } from "../../api/chats.js";
import { useAuth } from "../../context/useAuth.js";

export default function ChatMessages() {
  const { chatId } = useParams();
  const { user } = useAuth();

  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

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
    } catch (err) {
      console.error(err);

      // rollback
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    }
  }

  function toggleEdit() {}

  function addMember() {}

  function leaveChat() {}

  if (loading) return <div>Loading...</div>;
  if (!chat) return <div>Chat not found</div>;

  return (
    <section className={styles.chatMessagesSection}>
      <div className={styles.chatHeader}>
        <h2>{getChatName()}</h2>

        <div className={styles.chatHeaderControls}>
          <Button size="sm" onClick={toggleEdit}>
            Edit Chat Name
          </Button>

          <Button size="sm" onClick={addMember}>
            Add Member
          </Button>

          <Button size="sm" variant="danger" onClick={leaveChat}>
            Leave Chat
          </Button>
        </div>
      </div>

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
