import { createBrowserRouter } from "react-router";
import App from "../App.jsx";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute.jsx";

import Home from "../pages/Home/Home.jsx";
import Login from "../pages/Login/Login.jsx";
import Register from "../pages/Register/Register.jsx";
import CreateChat from "../pages/CreateChat/CreateChat.jsx";
import ChatMessages from "../pages/ChatMessages/ChatMessages.jsx";
import ErrorPage from "../pages/ErrorPage/ErrorPage.jsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		errorElement: <ErrorPage />,
		children: [
			{ index: true, element: <Home /> },
			{ path: "login", element: <Login /> },
			{ path: "register", element: <Register /> },
			{
				path: "chats/new",
				element: (
					<ProtectedRoute>
						<CreateChat />
					</ProtectedRoute>
				),
			},
			{
				path: "chats/:chatId",
				element: (
					<ProtectedRoute>
						<ChatMessages />
					</ProtectedRoute>
				),
			},
		],
	},
]);

export default router;
