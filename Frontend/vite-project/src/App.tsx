import { useEffect } from "react";
import "./App.css";
import Router from "../src/components/Routes/router.tsx";
import { initGA } from "./utils/analytics";

function App() {
  // Initialize Google Analytics
  useEffect(() => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (measurementId) {
      initGA(measurementId);
      console.log("Google Analytics initialized with ID:", measurementId);
    } else {
      console.warn(
        "Google Analytics Measurement ID not found. Add VITE_GA_MEASUREMENT_ID to your .env file"
      );
    }
  }, []);

  return (
    <>
      <div>
        <Router />
      </div>
    </>
  );
}

export default App;
