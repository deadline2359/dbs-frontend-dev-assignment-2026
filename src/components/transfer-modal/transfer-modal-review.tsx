import type { Account } from "../../api/types";
import { formatMoney } from "../../lib/format";

export default function TransferModalReview({
  account,
  recipientName,
  recipientBank,
  recipientAccount,
  amount,
  note,
  errorFields,
}: {
  account: Account | undefined;
  recipientName: string;
  recipientBank: string;
  recipientAccount: string;
  amount: number;
  note: string;
  errorFields?: {
    [key: string]: string;
  };
}) {
  return (
    <div className="transfer-modal-review">
      {errorFields && (
        <p className="transfer-modal-error" role="alert">
          Something went wrong. Your money hasn't left your account. Try again.
        </p>
      )}
      <h3>Check the details</h3>
      <dl>
        <div>
          <dt>From</dt>
          <dd>
            {account?.name} · {account?.maskedNumber}
          </dd>
        </div>
        <div>
          <dt>To</dt>
          <dd>
            {recipientName} · {recipientBank} · {recipientAccount}
          </dd>
        </div>
        <div>
          <dt>Amount</dt>
          <dd>{formatMoney(amount)}</dd>
        </div>
        <div>
          <dt>Fee</dt>
          <dd>{formatMoney(0.0)}</dd>
        </div>
        <div>
          <dt>Note</dt>
          <dd>{note || "—"}</dd>
        </div>
      </dl>
      <hr />
      <div className="transfer-modal-review-total">
        <strong>Total</strong>
        <strong>{formatMoney(amount)}</strong>
      </div>
      <p className="transfer-modal-review-hint">
        ⓘ Usually arrives in minutes.
      </p>
      {errorFields && (
        <p className="transfer-modal-error" role="alert">
          {Object.values(errorFields).map((errorMessage, index) => (
            <span key={index}>
              {errorMessage}
              <br />
            </span>
          ))}
        </p>
      )}
    </div>
  );
}
