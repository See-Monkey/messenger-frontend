import { useState } from "react";
import { useNavigate } from "react-router";
import styles from "./CreateChat.module.css";
import { createChat } from "../../api/chats.js";
// import { useAuth } from "../../context/useAuth.js";
import Button from "../../components/Button/Button.jsx";
import UserSearch from "../../components/UserSearch/UserSearch.jsx";
import defaultAvatar from "../../icons/account-circle.svg";

export default function CreateChat() {
  const navigate = useNavigate();
  // const { user } = useAuth();

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  function addUser(u) {
    setSelectedUsers((prev) => {
      if (prev.find((p) => p.id === u.id)) return prev;
      return [...prev, u];
    });
  }

  function removeUser(id) {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== id));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (selectedUsers.length === 0) return;

    try {
      setLoading(true);

      const chat = await createChat({
        userIds: selectedUsers.map((u) => u.id),
        name: selectedUsers.length > 1 ? name : undefined,
      });

      navigate(`/chats/${chat.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={styles.createChatSection}>
      <h2>Create New Chat</h2>

      <form onSubmit={handleSubmit} className={styles.createChatForm}>
        <div>
          <UserSearch onSelectUser={addUser} selectedUsers={selectedUsers} />
        </div>

        <div className={styles.selectedUsersContainer}>
          {selectedUsers.length > 0 && <h4>Selected Users</h4>}

          {selectedUsers.map((u) => (
            <div key={u.id} className={styles.selectedUserContainer}>
              <div className={styles.userContainer}>
                <img
                  src={u.avatarUrl ? u.avatarUrl : defaultAvatar}
                  alt="avatar"
                  className={styles.avatar}
                />
                <p>{u.displayName}</p>
              </div>
              <Button
                type="button"
                onClick={() => removeUser(u.id)}
                variant="danger"
                size="sm"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        {selectedUsers.length > 1 && (
          <div>
            <input
              type="text"
              placeholder="Group name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div>
          <Button
            type="submit"
            disabled={loading || selectedUsers.length === 0}
          >
            {loading ? "Creating..." : "Create Chat"}
          </Button>
        </div>
      </form>
    </section>
  );
}
