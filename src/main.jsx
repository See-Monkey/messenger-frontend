import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./reset.css";

import AppRoutes from "./routes/AppRoutes.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={AppRoutes} />
		</QueryClientProvider>
	</StrictMode>,
);
