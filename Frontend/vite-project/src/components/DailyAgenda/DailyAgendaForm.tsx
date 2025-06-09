import { useState } from "react";
import styles from "./DailyAgendaForm.module.css";
import DailyPlanModal from "./DailyPlanModal";

type Props = {
  onBack: () => void;
  onNext: () => void;
};

type DailyPlan = {
  day: number;
  name: string;
  description: string;
};

const DailyAgendaForm = ({ onBack, onNext }: Props) => {
  const [dailyPlans, setDailyPlans] = useState<DailyPlan[]>([]);
  const [showModal, setShowModal] = useState(false);

  const addNewPlan = () => setShowModal(true);

  const handleAddPlan = (name: string, description: string) => {
    const newDay = dailyPlans.length + 1;
    setDailyPlans([...dailyPlans, { day: newDay, name, description }]);
    setShowModal(false);
  };

  return (
    <div>
      <h2 className={styles.title}>Daily plan details</h2>
      <p className={styles.subtext}>Enter your daily agenda one by one</p>

      <div className={styles.uploadBox}>
        <button type="button" className={styles.addBtn} onClick={addNewPlan}>
          Add daily plan
        </button>
      </div>

      <div className={styles.buttonRow}>
        <button className={styles.backBtn} onClick={onBack}>
          Back
        </button>
        <button className={styles.nextBtn} onClick={onNext}>
          Next
        </button>
      </div>
      {showModal && (
        <DailyPlanModal
          day={dailyPlans.length + 1}
          onAdd={handleAddPlan}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default DailyAgendaForm;
