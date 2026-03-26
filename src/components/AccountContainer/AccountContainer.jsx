import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/useAuth.js";
import styles from "./AccountContainer.module.css";

export default function AccountContainer() {
	const { user, isAuthenticated, logout, loading } = useAuth();
	const [open, setOpen] = useState(false);
	const menuRef = useRef();
	const navigate = useNavigate();

	// close on outside click
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
		return <div className={styles.container}>...</div>; // or nothing
	}

	if (!isAuthenticated) {
		return (
			<div className={styles.container}>
				<Link to="/login">Login</Link>
				<Link to="/register">Register</Link>
			</div>
		);
	}

	return (
		<div className={styles.container} ref={menuRef}>
			<div className={styles.userInfo}>
				<img
					src={user?.avatarUrl || "/mailbox-green.svg"}
					alt="avatar"
					className={styles.avatar}
				/>
				<span>{user?.displayName || user?.username}</span>
			</div>

			<button className={styles.gear} onClick={() => setOpen((prev) => !prev)}>
				⚙
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
						}}
					>
						Logout
					</button>
				</div>
			)}
		</div>
	);
}
