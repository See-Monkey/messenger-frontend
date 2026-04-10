export default function truncateText(str, maxLength) {
  if (typeof str !== "string") return "";
  if (maxLength <= 0) return "";

  if (str.length <= maxLength) return str;

  if (maxLength <= 3) {
    // Not enough room for full ellipsis + text
    return ".".repeat(maxLength);
  }

  return str.slice(0, maxLength - 3) + "...";
}
