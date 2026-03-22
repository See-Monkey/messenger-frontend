import { createBrowserRouter } from "react-router";
import App from "../App.jsx";

import Home from "../pages/Home/Home.jsx";
import Login from "../pages/Login/Login.jsx";
import ErrorPage from "../pages/ErrorPage/ErrorPage.jsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		errorElement: <ErrorPage />,
		children: [
			{ index: true, element: <Home /> },
			{ path: "login", element: <Login /> },
		],
	},
]);

export default router;
