import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import styles from "./Navbar.module.css";
import AccountContainer from "../AccountContainer/AccountContainer";
import plusIcon from "../../icons/plus-circle-outline.svg";
import { getChats } from "../../api/chats.js";
import { useAuth } from "../../context/useAuth.js";

export default function Navbar() {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    async function loadChats() {
      try {
        const res = await getChats();
        setChats(res.chats || []);
        setNextCursor(res.nextCursor);
      } catch (err) {
        console.error(err);
      }
    }

    loadChats();
  }, [user]);

  const loadMoreChats = async () => {
    if (!nextCursor || loadingMore) return;

    try {
      setLoadingMore(true);

      const res = await getChats(nextCursor);

      setChats((prev) => [...prev, ...res.chats]);
      setNextCursor(res.nextCursor);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleScroll = (e) => {
    const el = e.target;

    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;

    if (nearBottom) {
      loadMoreChats();
    }
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.upperNav}>
        <h1 className={styles.logo}>Messenger</h1>

        <div className={styles.chatsContainer} onScroll={handleScroll}>
          {/* Create chat */}
          <NavLink
            to="/chats/new"
            className={({ isActive }) =>
              `${styles.newChatBtn} ${isActive ? styles.active : ""}`
            }
          >
            <img
              src={plusIcon}
              alt="create new chat"
              className={styles.plusIcon}
            />
          </NavLink>

          {/* Chat list */}
          {chats.map((chat) => {
            const otherMember = chat.chatMembers?.find(
              (m) => m.user.id !== user?.id,
            );

            const label = chat.isGroup
              ? chat.name || "Group"
              : otherMember?.user.displayName || "Chat";

            const borderColor = chat.isGroup
              ? "#ccc"
              : otherMember?.user.themeColor || "#ccc";

            const lastMessage = chat.messages?.[0];

            const preview = lastMessage?.deletedAt
              ? "Message deleted"
              : lastMessage?.content || "";

            return (
              <NavLink
                key={chat.id}
                to={`/chats/${chat.id}`}
                className={({ isActive }) =>
                  `${styles.chatBtn} ${isActive ? styles.active : ""}`
                }
                style={{ borderColor }}
              >
                <div className={styles.chatLabel}>{label}</div>

                {preview && <div className={styles.chatPreview}>{preview}</div>}
              </NavLink>
            );
          })}

          {loadingMore && <div className={styles.loading}>Loading...</div>}
        </div>
      </div>

      <div className={styles.accountContainer}>
        <AccountContainer />
      </div>
    </nav>
  );
}
