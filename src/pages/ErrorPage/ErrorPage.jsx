import styles from "./ErrorPage.module.css";
import confusedMonkey from "../../images/confused-monkey.png";
import { Link } from "react-router";

export default function ErrorPage() {
	return (
		<main className={styles.main}>
			<div className={styles.errorContainer}>
				<h1>Hmm, something isn't right</h1>
				<div className={styles.errorContent}>
					<img src={confusedMonkey} alt="confused monkey" />
					<p>
						The page you're looking for doesn't seem to exist or has been moved.
					</p>
				</div>
				<p>
					Click <Link to={"/"}>here</Link> to go back to safety.
				</p>
			</div>
		</main>
	);
}
