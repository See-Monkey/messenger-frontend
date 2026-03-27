import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import "./app.css";
import { getThemeVars, DEFAULT_THEME } from "./theme.js";
import { getMe } from "./api/users.js";
import Navbar from "./components/Navbar/Navbar.jsx";

function App() {
	const [theme, setTheme] = useState(DEFAULT_THEME);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		async function loadUser() {
			try {
				const user = await getMe();

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
