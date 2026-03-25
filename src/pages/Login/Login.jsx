import { useState } from "react";
import { useAuth } from "../../context/useAuth.js";
import { useNavigate } from "react-router";
import styles from "./Login.module.css";

export default function Login() {
	const { login } = useAuth();
	const navigate = useNavigate();

	const [form, setForm] = useState({
		username: "",
		password: "",
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
			await login(form);
			navigate("/");
		} catch (err) {
			setError(err.message);
		}
	}

	return (
		<section className={styles.loginSection}>
			<form onSubmit={handleSubmit} className={styles.loginForm}>
				<h2 className={styles.loginHeader}>Login</h2>
				{error && <p>{error}</p>}
				<label>
					Email Address:
					<input
						name="username"
						type="email"
						placeholder="Email"
						value={form.username}
						onChange={handleChange}
					/>
				</label>

				<label>
					Password:
					<input
						name="password"
						type="password"
						placeholder="Password"
						value={form.password}
						onChange={handleChange}
					/>
				</label>
				<button type="submit" className={styles.loginBtn}>
					Login
				</button>
			</form>
		</section>
	);
}
