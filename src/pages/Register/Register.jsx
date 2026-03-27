import { useState } from "react";
import { useAuth } from "../../context/useAuth.js";
import { useNavigate } from "react-router";
import styles from "./Register.module.css";
import Button from "../../components/Button/Button.jsx";

export default function Register() {
	const { register } = useAuth();
	const navigate = useNavigate();

	const [form, setForm] = useState({
		username: "",
		displayName: "",
		avatarUrl: "",
		themeColor: "",
		password: "",
		confirmPassword: "",
	});

	const [error, setError] = useState(null);

	function handleChange(e) {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setError(null);

		try {
			await register(form);
			navigate("/");
		} catch (err) {
			setError(err.message);
		}
	}

	return (
		<section className={styles.registerSection}>
			<form onSubmit={handleSubmit} className={styles.registerForm}>
				<h2 className={styles.registerHeader}>Register</h2>
				{error && <p>{error}</p>}
				<label>
					Email Address:
					<input
						name="username"
						type="email"
						value={form.username}
						onChange={handleChange}
						autoComplete="email"
						required
					/>
				</label>

				<label>
					Display Name:
					<input
						name="displayName"
						type="string"
						value={form.displayName}
						onChange={handleChange}
						autoComplete="username"
					/>
				</label>

				<label>
					Avatar URL:
					<input
						name="avatarUrl"
						type="string"
						value={form.avatarUrl}
						onChange={handleChange}
					/>
				</label>

				<label>
					Theme Color:
					<input
						name="themeColor"
						type="string"
						value={form.themeColor}
						onChange={handleChange}
					/>
				</label>

				<label>
					Password:
					<input
						name="password"
						type="password"
						value={form.password}
						onChange={handleChange}
						autoComplete="currentPassword"
						required
					/>
				</label>

				<label>
					Confirm Password:
					<input
						name="confirmPassword"
						type="password"
						value={form.confirmPassword}
						onChange={handleChange}
						autoComplete="currentPassword"
						required
					/>
				</label>

				<Button type="submit" className={styles.registerBtn}>
					Register
				</Button>
			</form>
		</section>
	);
}
