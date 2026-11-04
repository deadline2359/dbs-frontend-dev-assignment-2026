import type { Account } from "../../api/types";
import { formatMoney } from "../../lib/format";
import "./balance-styling.css";
import { hideBalance } from "../../helpers";

export default function BalanceContainer({
  depositAccounts,
  setIsTransferModalOpen,
  isBalanceVisible,
}: {
  depositAccounts: Account[];
  setIsTransferModalOpen: (isOpen: boolean) => void;
  isBalanceVisible: boolean;
}) {
  const totalBalance = depositAccounts.reduce(
    (acc, account) => acc + account.balance,
    0,
  );

  return (
    <div className="balance-container">
      <div className="balance-container-header">
        <h3>TOTAL AVAILABLE</h3>
        <button
          className="btn btn-primary new-transfer-btn"
          onClick={() => setIsTransferModalOpen(true)}
        >
          Transfer
        </button>
      </div>
      <div className="balance-container-content">
        <p>
          {hideBalance(formatMoney(totalBalance), isBalanceVisible)} across{" "}
          {depositAccounts.length} deposit accounts
        </p>
      </div>
    </div>
  );
}
