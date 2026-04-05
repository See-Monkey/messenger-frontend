import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/useAuth.js";
import styles from "./AccountContainer.module.css";
import cog from "../../icons/cog.svg";

export default function AccountContainer() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (loading) {
    return <div className={styles.container}>...</div>;
  }

  // Not logged in, display login / register links
  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    );
  }

  // Account container
  return (
    <div className={styles.container} ref={menuRef}>
      <div className={styles.userInfo}>
        {/* Avatar */}
        <img
          src={user?.avatarUrl || "./mailbox-green.svg"}
          alt="avatar"
          className={styles.avatar}
        />

        {/* Display name */}
        <p className={styles.displayName}>
          {user?.displayName || user?.username}
        </p>
      </div>

      {/* Settings popup menu */}
      <button className={styles.gear} onClick={() => setOpen((prev) => !prev)}>
        <img src={cog} alt="settings icon" className={styles.settingsIcon} />
      </button>

      {open && (
        <div className={styles.dropdown}>
          <Link to="/account" onClick={() => setOpen(false)}>
            Account
          </Link>

          <button
            onClick={() => {
              logout();
              navigate("/");
              setOpen(false);
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
