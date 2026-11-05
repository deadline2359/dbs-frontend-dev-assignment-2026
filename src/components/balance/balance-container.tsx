import type { Account } from "../../api/types";
import { formatMoney } from "../../lib/format";
import "./balance-styling.css";
import { filterForDepositAccounts, hideBalance } from "../../helpers";

export default function BalanceContainer({
  accounts,
  setIsTransferModalOpen,
  isBalanceVisible,
}: {
  accounts: Account[];
  setIsTransferModalOpen: (isOpen: boolean) => void;
  isBalanceVisible: boolean;
}) {

  const depositAccounts = filterForDepositAccounts(accounts);

  const totalBalance = accounts.reduce(
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
          disabled={depositAccounts.length === 0}
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
