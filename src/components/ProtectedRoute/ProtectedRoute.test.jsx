import { describe, test, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import ProtectedRoute from "./ProtectedRoute";
import { renderWithRouter } from "../../tests/test-utils";
import { mockAuth } from "../../tests/mocks/useAuth";

const useAuthMock = vi.fn();

vi.mock("../../context/useAuth.js", () => ({
	useAuth: () => useAuthMock(),
}));

describe("ProtectedRoute", () => {
	test("blocks access when unauthenticated", () => {
		useAuthMock.mockReturnValue(mockAuth({ isAuthenticated: false }));
		renderWithRouter(
			<ProtectedRoute>
				<div>Secret</div>
			</ProtectedRoute>,
		);

		expect(screen.queryByText("Secret")).not.toBeInTheDocument();
	});

	test("blocks authenticated access when admin required", () => {
		useAuthMock.mockReturnValue(mockAuth({ isAuthenticated: true }));
		renderWithRouter(
			<ProtectedRoute requireAdmin>
				<div>Secret</div>
			</ProtectedRoute>,
		);

		expect(screen.queryByText("Secret")).not.toBeInTheDocument();
	});

	test("allows access when credentials are met", () => {
		useAuthMock.mockReturnValue(
			mockAuth({ isAuthenticated: true, isAdmin: true }),
		);
		renderWithRouter(
			<ProtectedRoute requireAdmin>
				<div>Secret</div>
			</ProtectedRoute>,
		);

		expect(screen.queryByText("Secret")).toBeInTheDocument();
	});
});
