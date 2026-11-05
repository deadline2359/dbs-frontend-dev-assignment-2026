import { weekdays } from "../../constants";
import type { Customer, Account } from "../../api/types";
import BalanceContainer from "../balance/balance-container";
import AccountsContainer from "../account/accounts-container";
import TransactionContainer from "../transaction/transaction-container";
import { formatShortDate } from "../../lib/format";
import { useState } from "react";
import "./main-content-styling.css";

export default function MainContent({
  customer,
  accounts,
  setIsTransferModalOpen,
  accountsIsPending,
  accountsIsError,
}: {
  customer: Customer;
  accounts: Account[];
  setIsTransferModalOpen: (isOpen: boolean) => void;
  accountsIsPending: boolean;
  accountsIsError: boolean;
}) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  // deconstructure customer
  const { firstName } = customer;

  // extract datetime info
  const dateTime = new Date();
  const weekday = weekdays[dateTime.getDay()];

  return (
    <div className="main-content">
      <div>
        <h1>Good evening, {firstName}</h1>
        <span>
          {weekday}, {formatShortDate(dateTime.toISOString())}
        </span>
      </div>
      {accountsIsPending ? (
        <span>Loading accounts...</span>
      ) : (
        (accounts.length === 0 || accountsIsError) && (
          <div>
            <span className="error-text" role="alert">
              Unable to load accounts. Please try again later.
            </span>
          </div>
        )
      )}

      <div className="balance-visibility-toggle-container">
        <button
          type="button"
          className="balance-visibility-toggle"
          aria-pressed={isBalanceVisible}
          onClick={() => setIsBalanceVisible((visible) => !visible)}
        >
          {isBalanceVisible ? "Hide balance" : "Show balance"}
        </button>
      </div>
      <BalanceContainer
        accounts={accounts}
        setIsTransferModalOpen={setIsTransferModalOpen}
        isBalanceVisible={isBalanceVisible}
      />
      <AccountsContainer
        accounts={accounts}
        isBalanceVisible={isBalanceVisible}
      />
      <TransactionContainer />
    </div>
  );
}
