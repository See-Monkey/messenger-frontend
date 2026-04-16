import { DEFAULT_THEME } from "../../theme.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ColorPicker from "../../components/HexColorPicker/ColorPicker.jsx";
import {
  getMe,
  updateMe,
  changeMyPassword,
  deleteMe,
} from "../../api/users.js";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal.jsx";
import Button from "../../components/Button/Button.jsx";
import styles from "./Account.module.css";
import { useAuth } from "../../context/useAuth.js";
import defaultAvatar from "../../icons/account-circle.svg";

export default function Account() {
  const navigate = useNavigate();

  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    displayName: "",
    avatarUrl: "",
    themeColor: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Feedback states
  const [profileError, setProfileError] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState(null);

  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);

  const [deleteError, setDeleteError] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);

  // Load account
  useEffect(() => {
    async function load() {
      try {
        const data = await getMe();

        setUser(data); // <-- sync global state

        setForm({
          displayName: data.displayName || "",
          avatarUrl: data.avatarUrl || "",
          themeColor: data.themeColor || "",
        });
      } catch (err) {
        setProfileError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [setUser]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handlePasswordChange(e) {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));

    // Live validation
    if (name === "confirmPassword" || name === "newPassword") {
      if (
        name === "confirmPassword"
          ? value !== passwordForm.newPassword
          : passwordForm.confirmPassword !== value
      ) {
        setPasswordError("Passwords do not match");
      } else {
        setPasswordError(null);
      }
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();

    setProfileError(null);
    setProfileSuccess(null);

    try {
      const updated = await updateMe(form);
      setUser(updated);
      setProfileSuccess("Profile updated successfully");
    } catch (err) {
      setProfileError(err.message);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();

    setPasswordError(null);
    setPasswordSuccess(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      await changeMyPassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordSuccess("Password updated successfully");

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setPasswordError(err.message);
    }
  }

  function handleDelete() {
    setShowConfirm(true);
  }

  async function confirmDelete() {
    try {
      await deleteMe();
      navigate("/login");
    } catch (err) {
      setDeleteError(err.message);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No user found</div>;

  return (
    <section className={styles.accountSection}>
      <div className={styles.accountContainer}>
        <h2>My Account</h2>

        <div className={styles.avatarContainer}>
          <h3>{user.username}</h3>
          <img
            src={user.avatarUrl || defaultAvatar}
            alt="avatar"
            className={styles.avatar}
          />
        </div>

        {/* Profile form */}
        <form onSubmit={handleUpdate} className={styles.profileForm}>
          <h3>Update Profile</h3>
          <div>
            <label>
              Display Name :
              <input
                name="displayName"
                value={form.displayName}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              Avatar URL :
              <input
                name="avatarUrl"
                value={form.avatarUrl}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              Theme Color :
              <ColorPicker
                color={form.themeColor || DEFAULT_THEME}
                onChange={(color) =>
                  setForm((prev) => ({ ...prev, themeColor: color }))
                }
              />
            </label>
          </div>
          <Button type="submit" className={styles.updateProfileBtn}>
            Update Profile
          </Button>
          {/* Inline feedback */}
          {profileError && (
            <div className={styles.feedback}>{profileError}</div>
          )}
          {profileSuccess && (
            <div className={styles.feedback}>{profileSuccess}</div>
          )}
        </form>

        {/* Password form */}
        <form onSubmit={handleChangePassword} className={styles.passwordForm}>
          <h3>Change Password</h3>
          <div>
            <label>
              Current Password :
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
              />
            </label>
          </div>
          <div>
            <label>
              New Password :
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
              />
            </label>
          </div>
          <div>
            <label>
              Confirm Password :
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
              />
            </label>
          </div>
          <Button type="submit" className={styles.changePasswordBtn}>
            Change Password
          </Button>
          {/* Inline feedback */}
          {passwordError && (
            <div className={styles.feedback}>{passwordError}</div>
          )}
          {passwordSuccess && (
            <div className={styles.feedback}>{passwordSuccess}</div>
          )}
        </form>

        {/* Delete */}
        <div className={styles.deleteContainer}>
          <h3>Delete Account</h3>
          <p className={styles.warningMsg}>
            WARNING: There will be no way to recover your account after
            deletion.
          </p>
          <Button
            onClick={handleDelete}
            type="button"
            className={styles.deleteAccountBtn}
            variant="danger"
          >
            Delete
          </Button>
          {deleteError && <div>{deleteError}</div>}
        </div>

        <ConfirmModal
          isOpen={showConfirm}
          message="Are you sure you want to delete your account?"
          confirmText="Delete Forever"
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
      </div>
    </section>
  );
}
