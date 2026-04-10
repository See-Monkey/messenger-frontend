import { HexColorPicker } from "react-colorful";
import styles from "./ColorPicker.module.css";

export default function ColorPicker({ color, onChange }) {
  return (
    <div className={styles.colorPickerContainer}>
      <HexColorPicker color={color} onChange={onChange} />
      <p>{color}</p>
    </div>
  );
}
