import { transferModalSteps } from "../../constants";

export default function TransferModalStepper({
  currentStep,
}: {
  currentStep: number;
}) {
  return (
    <p className="transfer-modal-stepper">
      <span
        className={`${currentStep === 1 ? "transfer-modal-stepper-active" : ""}`}
      >
        {transferModalSteps[0]}
      </span>
      ·
      <span
        className={`${currentStep === 2 ? "transfer-modal-stepper-active" : ""}`}
      >
        {transferModalSteps[1]}
      </span>
      ·
      <span
        className={`${currentStep === 3 ? "transfer-modal-stepper-active" : ""}`}
      >
        {transferModalSteps[2]}
      </span>
    </p>
  );
}
