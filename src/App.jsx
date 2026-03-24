import { Outlet } from "react-router";
import "./app.css";
import Navbar from "./components/Navbar/Navbar.jsx";

function App() {
	return (
		<main>
			<Navbar />
			<Outlet />
		</main>
	);
}

export default App;
