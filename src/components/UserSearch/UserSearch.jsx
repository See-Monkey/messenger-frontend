import { useEffect, useState } from "react";
import styles from "./UserSearch.module.css";
import { searchUsers } from "../../api/users.js";
import defaultAvatar from "../../icons/account-circle.svg";

export default function UserSearch({ onSelectUser, selectedUsers = [] }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await searchUsers(query);

        // filter out already selected users
        const filtered = data.filter(
          (u) => !selectedUsers.some((su) => su.id === u.id),
        );

        setResults(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300); // debounce

    return () => clearTimeout(timeout);
  }, [query, selectedUsers]);

  return (
    <div className={styles.userSearchContainer}>
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className={styles.usersContainer}>
        {loading && <div>Loading...</div>}

        {results.map((user) => (
          <div
            key={user.id}
            onClick={() => {
              onSelectUser(user);
              setQuery("");
              setResults([]);
            }}
            className={styles.userContainer}
          >
            <img
              src={user.avatarUrl ? user.avatarUrl : defaultAvatar}
              alt="avatar"
              className={styles.avatar}
            />

            <div className={styles.nameContainer}>
              <p>{user.displayName}</p>
              <p>{user.username}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
