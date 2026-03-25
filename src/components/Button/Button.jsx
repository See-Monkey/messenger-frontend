import styles from "./Button.module.css";

export default function Button({
	variant = "primary",
	size = "md",
	loading = false,
	className = "",
	disabled = false,
	children,
	...props
}) {
	const isDisabled = disabled || loading;

	const classes = [
		styles.button,
		styles[variant],
		styles[size],
		isDisabled ? styles.disabled : "",
		loading ? styles.loading : "",
		className,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<button
			type="button"
			className={classes}
			disabled={isDisabled}
			aria-busy={loading}
			{...props}
		>
			{loading ? "Loading" : children}
		</button>
	);
}
