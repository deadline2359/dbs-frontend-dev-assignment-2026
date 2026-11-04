export default function TransferModalFooter({
  currentStep,
  setCurrentStep,
  isSending,
  onCancel,
  isContinueDisabled,
  onContinue,
  onConfirm,
}: {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isSending: boolean;
  onCancel: () => void;
  isContinueDisabled?: boolean;
  onContinue: () => void;
  onConfirm: () => void;
}) {

  console.log('isSending', isSending);
  return (
    <div className="transfer-modal-footer">
      {currentStep === 1 ? (
        <button
          className="transfer-modal-cancel-btn"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
      ) : (
        <button
          className="transfer-modal-back-btn"
          type="button"
          onClick={() => setCurrentStep(currentStep - 1)}
        >
          ← Back
        </button>
      )}
      {currentStep < 3 ? (
        <button
          className="transfer-modal-continue-btn"
          type="button"
          onClick={onContinue}
          disabled={isContinueDisabled}
        >
          Continue
        </button>
      ) : (
        <button
          className="transfer-modal-continue-btn"
          type="button"
          disabled={isSending}
          onClick={onConfirm}
        >
          {isSending ? "Sending…" : "Confirm transfer"}
        </button>
      )}
    </div>
  );
}
