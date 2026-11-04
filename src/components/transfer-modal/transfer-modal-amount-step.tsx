import type { Account, Customer } from "../../api/types";
import {
  filterForDepositAccounts,
  getRemainingTransferLimit,
} from "../../helpers";
import { formatMoney } from "../../lib/format";
import TransferModalInput from "./transfer-modal-input";

export default function TransferModalAmountStep({
  customer: { transferredToday, dailyTransferLimit },
  accounts,
  amount,
  setAmount,
  accountId,
  note,
  setAccountId,
  setNote,
  errors,
  onBlur,
}: {
  customer: Customer;
  accounts: Account[];
  amount: number;
  accountId: string;
  note: string;
  setAmount: (amount: number) => void;
  setAccountId: (accountId: string) => void;
  setNote: (note: string) => void;
  errors: { amount?: string; note?: string };
  onBlur: (field: "amount" | "note") => void;
}) {
  const depositAccounts = filterForDepositAccounts(accounts);
  const selectableAmounts = [50, 100, 250, 500];

  return (
    <div>
      <h3>How much?</h3>
      <div className="transfer-modal-step">
        <div className="transfer-modal-input">
          <label htmlFor="from-account-select">From account</label>
          <select
            id="from-account-select"
            value={accountId || ""}
            onChange={(e) => setAccountId(e.target.value)}
          >
            {depositAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} · {account.maskedNumber}
              </option>
            ))}
          </select>
          <span className="info">Deposit accounts only</span>
        </div>

        <div className="transfer-modal-amount-input">
          <TransferModalInput
            type="number"
            fieldLabel="Amount"
            fieldId="amount"
            value={amount}
            error={errors.amount}
            onBlur={() => onBlur("amount")}
            placeholder="0.00"
            onChange={(value) => setAmount(parseFloat(value))}
          />
          <div className="transfer-modal-selectable-amts">
            {selectableAmounts.map((selectableAmount) => (
              <button
                key={selectableAmount}
                type="button"
                onClick={() => {
                  setAmount(selectableAmount);
                }}
                onBlur={() => onBlur("amount")}
              >
                {selectableAmount}
              </button>
            ))}
          </div>
          <span className="info">
            {`Available ${formatMoney(accounts.find((account) => account.id === accountId)?.balance || 0)}`}
          </span>
          <span className="info">
            {`Remaining daily limit ${formatMoney(getRemainingTransferLimit(transferredToday, dailyTransferLimit))}`}
          </span>
        </div>

        <TransferModalInput
          fieldLabel="Note (optional)"
          fieldId="note"
          value={note}
          error={errors.note}
          onBlur={() => onBlur("note")}
          onChange={(value) => setNote(value)}
          characterLimit={50}
        />
      </div>
    </div>
  );
}
