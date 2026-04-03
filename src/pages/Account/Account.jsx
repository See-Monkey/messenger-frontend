import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
	getMe,
	updateMe,
	changeMyPassword,
	deleteMe,
} from "../../api/users.js";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal.jsx";
import styles from "./Account.module.css";
import defaultAvatar from "../../icons/account-circle.svg";

export default function Account() {
	const navigate = useNavigate();

	const [user, setUser] = useState(null);
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
				setUser(data);

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
	}, []);

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
			<h2>My Account</h2>

			<div>
				<img src={user.avatarUrl || defaultAvatar} alt="avatar" />
				<div>Username: {user.username}</div>
			</div>

			{/* Profile form */}
			<form onSubmit={handleUpdate}>
				<h3>Update Profile</h3>

				<div>
					<label>
						Display Name:
						<input
							name="displayName"
							value={form.displayName}
							onChange={handleChange}
						/>
					</label>
				</div>

				<div>
					<label>
						Avatar URL:
						<input
							name="avatarUrl"
							value={form.avatarUrl}
							onChange={handleChange}
						/>
					</label>
				</div>

				<div>
					<label>
						Theme Color:
						<input
							name="themeColor"
							value={form.themeColor}
							onChange={handleChange}
						/>
					</label>
				</div>

				<button type="submit">Update Profile</button>

				{/* Inline feedback */}
				{profileError && <div>{profileError}</div>}
				{profileSuccess && <div>{profileSuccess}</div>}
			</form>

			{/* Password form */}
			<form onSubmit={handleChangePassword}>
				<h3>Change Password</h3>

				<div>
					<input
						type="password"
						name="currentPassword"
						placeholder="Current Password"
						value={passwordForm.currentPassword}
						onChange={handlePasswordChange}
					/>
				</div>

				<div>
					<input
						type="password"
						name="newPassword"
						placeholder="New Password"
						value={passwordForm.newPassword}
						onChange={handlePasswordChange}
					/>
				</div>

				<div>
					<input
						type="password"
						name="confirmPassword"
						placeholder="Confirm Password"
						value={passwordForm.confirmPassword}
						onChange={handlePasswordChange}
					/>
				</div>

				<button type="submit">Change Password</button>

				{/* Inline feedback */}
				{passwordError && <div>{passwordError}</div>}
				{passwordSuccess && <div>{passwordSuccess}</div>}
			</form>

			{/* Delete */}
			<div>
				<h3>Delete Account</h3>
				<button onClick={handleDelete}>Delete</button>
				{deleteError && <div>{deleteError}</div>}
			</div>

			<ConfirmModal
				isOpen={showConfirm}
				message="Are you sure you want to delete your account?"
				confirmText="Delete Forever"
				onConfirm={confirmDelete}
				onCancel={() => setShowConfirm(false)}
			/>
		</section>
	);
}
