import { formatMoney } from "../../lib/format";

export default function TransferModalSuccess({
  amount,
  recipientName,
  recipientBank,
  recipientAccount,
  reference,
  onBackToDashboard,
  onMakeAnotherTransfer,
}: {
  amount: number;
  recipientName: string;
  recipientBank: string;
  recipientAccount: string;
  reference: string;
  onBackToDashboard: () => void;
  onMakeAnotherTransfer: () => void;
}) {
  return (
    <div className="transfer-modal-success" role="status" aria-live="polite">
      <div className="transfer-modal-success-icon" aria-hidden="true">
        ✓
      </div>
      <h2>Transfer sent</h2>
      <strong>{formatMoney(amount)}</strong>
      <p>
        to {recipientName} · {recipientBank} · {recipientAccount}
      </p>
      <p>
        <strong>Reference</strong> {reference}
      </p>
      <p>The money should arrive within minutes.</p>
      <div className="transfer-modal-success-actions">
        <button type="button" onClick={onBackToDashboard}>
          Back to dashboard
        </button>
        <button type="button" onClick={onMakeAnotherTransfer}>
          Make another transfer
        </button>
      </div>
    </div>
  );
}
