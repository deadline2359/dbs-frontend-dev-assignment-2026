import type { Account } from "../../api/types";
import { capitaliseFirstLetter, hideBalance } from "../../helpers";
import { formatMoney } from "../../lib/format";

export default function AccountCard({
  account: { type, maskedNumber, balance },
  isBalanceVisible,
}: {
  account: Account;
  isBalanceVisible: boolean;
}) {
  return (
    <div className="account-card">
      <h3>{capitaliseFirstLetter(type)}</h3>
      <span>{maskedNumber}</span>
      <span>
        {hideBalance(formatMoney(balance), isBalanceVisible)} {balance < 0 ? "Amount due" : ""}
      </span>
    </div>
  );
}
