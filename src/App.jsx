import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import "./app.css";
import { getThemeVars, DEFAULT_THEME } from "./theme.js";
import Navbar from "./components/Navbar/Navbar.jsx";

function App() {
	const [theme, setTheme] = useState(DEFAULT_THEME);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		async function loadUser() {
			try {
				const res = await fetch("/api/me"); // your auth endpoint
				const user = await res.json();

				if (user?.themeColor) {
					setTheme(user.themeColor);
				}
			} catch (err) {
				// fallback stays default
				console.error(err);
			} finally {
				setIsLoaded(true);
			}
		}

		loadUser();
	}, []);

	if (!isLoaded) return null;

	return (
		<main style={getThemeVars(theme)}>
			<Navbar />
			<Outlet />
		</main>
	);
}

export default App;
