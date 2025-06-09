type Props = {
  active: string;
  onChange: (step: string) => void;
};

const StepTabs = ({ active, onChange }: Props) => {
  return (
    <div className="flex space-x-6 border-b pb-2">
      {["details", "agenda", "includes"].map((step) => (
        <button
          key={step}
          onClick={() => onChange(step)}
          className={`capitalize ${
            active === step
              ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
              : "text-gray-500"
          }`}
        >
          {step === "details"
            ? "Package details"
            : step === "agenda"
            ? "Daily Agenda"
            : "Include & Not include details"}
        </button>
      ))}
    </div>
  );
};

export default StepTabs;
