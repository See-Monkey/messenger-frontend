import styles from "./Navbar.module.css";
import AccountContainer from "../AccountContainer/AccountContainer";

export default function Navbar() {
	return (
		<nav className={styles.nav}>
			<div className={styles.upperNav}>
				<h1>Messenger</h1>

				<div className={styles.chatsContainer}>
					{/* Create new chat button */}

					{/* Map through all chats */}
				</div>
			</div>

			<div className={styles.accountContainer}>
				<AccountContainer />
			</div>
		</nav>
	);
}
