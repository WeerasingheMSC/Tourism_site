import { useState } from "react";
import StepTabs from "./StepTabs";
import PackageDetailsForm from "./PackageDetailsForm";
import styles from "./AddPackagePage.module.css";
import DailyAgendaForm from "../DailyAgenda/DailyAgendaForm";

const AddPackagePage = () => {
  const [activeStep, setActiveStep] = useState("details");

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Add Packages</h1>
      <div className={styles.card}>
        <StepTabs active={activeStep} onChange={setActiveStep} />
        <div className={styles.formArea}>
          {activeStep === "details" && (
            <PackageDetailsForm onNext={() => setActiveStep("agenda")} />
          )}
          {activeStep === "agenda" && (
            <DailyAgendaForm
              onBack={() => setActiveStep("details")}
              onNext={() => setActiveStep("includes")}
            />
          )}
          {activeStep === "includes" && (
            <div>Include / Not include coming soon</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPackagePage;
