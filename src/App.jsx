import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import "./app.css";
import { useAuth } from "./context/useAuth.js";
import { getThemeVars, DEFAULT_THEME } from "./theme.js";
import { getMe } from "./api/users.js";
import Navbar from "./components/Navbar/Navbar.jsx";

export default function App() {
  const { isAuthenticated } = useAuth();
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const me = await getMe();

        if (me?.themeColor) {
          setTheme(me.themeColor);
        } else {
          setTheme(DEFAULT_THEME);
        }
      } catch (err) {
        console.error(err);
        setTheme(DEFAULT_THEME);
      } finally {
        setIsLoaded(true);
      }
    }

    if (isAuthenticated) {
      loadUser();
    } else {
      setTheme(DEFAULT_THEME);
      setIsLoaded(true);
    }
  }, [isAuthenticated]);

  if (!isLoaded) return null;

  return (
    <main style={getThemeVars(theme)}>
      <Navbar />
      <Outlet />
    </main>
  );
}
