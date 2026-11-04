export default function DiscardTransferDialog({
  onKeepEditing,
  onDiscard,
}: {
  onKeepEditing: () => void;
  onDiscard: () => void;
}) {
  return (
    <div className="discard-transfer-overlay">
      <div
        className="discard-transfer-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="discard-transfer-title"
      >
        <h3 id="discard-transfer-title">Discard this transfer?</h3>
        <p>Your entered transfer details will be lost.</p>
        <div className="discard-transfer-dialog-actions">
          <button type="button" onClick={onKeepEditing}>
            Keep editing
          </button>
          <button type="button" onClick={onDiscard}>
            Discard transfer
          </button>
        </div>
      </div>
    </div>
  );
}
