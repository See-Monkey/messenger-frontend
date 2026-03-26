import styles from "./Navbar.module.css";
import AccountContainer from "../AccountContainer/AccountContainer";

export default function Navbar() {
	return (
		<nav className={styles.nav}>
			<h1>Navbar</h1>

			<div className={styles.accountContainer}>
				<AccountContainer />
			</div>
		</nav>
	);
}
