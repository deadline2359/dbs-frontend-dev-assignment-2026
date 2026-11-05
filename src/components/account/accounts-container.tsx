import type { Account } from "../../api/types";
import AccountCard from "./account-card";
import "./account-styling.css";

export default function AccountsContainer({
  accounts,
  isBalanceVisible,
}: {
  accounts: Account[];
  isBalanceVisible: boolean;
}) {
  return (
    <div className="accounts-container">
      <h3>ACCOUNTS</h3>
      {accounts.length > 0 ? (
        accounts.map((account) => (
          <AccountCard key={account.id} account={account} isBalanceVisible={isBalanceVisible} />
        ))
      ) : (
        <p>No accounts available.</p>
      )}
    </div>
  );
}
