import styles from "./DailyPlanModal.module.css";
import { useState } from "react";

type Props = {
  day: number;
  onAdd: (name: string, description: string) => void;
  onCancel: () => void;
};

const DailyPlanModal = ({ day, onAdd, onCancel }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>
          Add daily plan <span className={styles.dayLabel}>( day {day} )</span>
        </h2>

        <input
          className={styles.input}
          type="text"
          placeholder="day plan name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className={styles.textarea}
          placeholder="Describe the plan clearly here……"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className={styles.buttonRow}>
          <button onClick={onCancel} className={styles.cancelBtn}>
            Cancel
          </button>
          <button
            onClick={() => onAdd(name, description)}
            className={styles.addBtn}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyPlanModal;
