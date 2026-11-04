import { useState } from "react";
import { useTransactions } from "../../hooks/transactions-hook";
import { abbreviatedMonths } from "../../constants";
import { capitaliseFirstLetter } from "../../helpers";
import { formatMoney } from "../../lib/format"
import "./transaction-styling.css";

export default function TransactionContainer() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isPending, isError } = useTransactions(searchQuery);
  const transactions = data?.transactions || [];

  return (
    <div className="transaction-container">
      <div className="transaction-container-header">
        <h3>RECENT TRANSACTIONS</h3>
        <div className="transactions-search">
          <input
            id="transactions-search-box"
            className="search-box"
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="transactions-search-clear"
              type="button"
              aria-label="Clear search"
              onClick={() => setSearchQuery("")}
            >
              ×
            </button>
          )}
        </div>
      </div>
      <div className="transaction-table-container">
        {isPending || isError ? (
          <p className="transaction-table-centre-text">
            {isPending
              ? "Loading transactions..."
              : "Error loading transactions. Please try again later."}
          </p>
        ) : transactions.length > 0 ? (
          <div className="transaction-table-results">
            <table>
              <tbody>
                {transactions.map((transaction) => {
                  const transactionDate = new Date(transaction.date);
                  const formattedDate = `${transactionDate.getDate()} ${abbreviatedMonths[transactionDate.getMonth()]}`;
                  const isNegative = transaction.direction === "out";
                  const formattedAmount = `${isNegative ? "-" : "+"}${formatMoney(transaction.amount)}`;

                  return (
                    <tr key={transaction.id}>
                      <td>{transaction.description}</td>
                      <td>{capitaliseFirstLetter(transaction.category)}</td>
                      <td>{formattedDate}</td>
                      <td
                        className={`transaction-table-${isNegative ? "negative" : "positive"}-value`}
                      >
                        {formattedAmount}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="transaction-table-info">
              ({transactions.length} newest, sorted by date descending)
            </p>
          </div>
        ) : (
          <p className="transaction-table-centre-text">
            No transactions found.
          </p>
        )}
      </div>
    </div>
  );
}
