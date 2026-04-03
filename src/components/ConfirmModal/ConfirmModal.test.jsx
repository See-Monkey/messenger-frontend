import { useState } from "react";
import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfirmModal from "./ConfirmModal";

describe("ConfirmModal", () => {
	test("calls confirm handler", async () => {
		const confirm = vi.fn();

		render(
			<ConfirmModal
				isOpen={true}
				message="Delete?"
				onConfirm={confirm}
				onCancel={() => {}}
			/>,
		);

		const confirmButton = await screen.findByText(/confirm/i);
		await userEvent.click(confirmButton);

		expect(confirm).toHaveBeenCalled();
	});

	//
	test("cancel closes modal", async () => {
		// wrapper to control isOpen
		function ModalWrapper() {
			const [isOpen, setIsOpen] = useState(true);

			return (
				<ConfirmModal
					isOpen={isOpen}
					message="Delete?"
					onConfirm={() => {}}
					onCancel={() => setIsOpen(false)} // clicking cancel closes modal
				/>
			);
		}

		render(<ModalWrapper />);

		// modal should be visible initially
		expect(screen.getByText(/delete\?/i)).toBeInTheDocument();

		const cancelButton = await screen.findByText(/cancel/i);
		await userEvent.click(cancelButton);

		// after click, modal should no longer be in the document
		expect(screen.queryByText(/delete\?/i)).not.toBeInTheDocument();
	});
});
