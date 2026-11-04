import type { Payee } from "../../api/types";
import { useState } from "react";

export default function TransferModalRecipientList({
  payees,
  isNewRecipientFormOpen,
  selectedPayeeId,
  setSelectedPayeeId,
  error,
  onBlur,
}: {
  payees: Payee[];
  isNewRecipientFormOpen: boolean;
  selectedPayeeId: string;
  setSelectedPayeeId: (payeeId: string) => void;
  error?: string;
  onBlur: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredPayees = payees.filter((payee) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      payee.name.toLowerCase().includes(lowerCaseQuery) ||
      payee.bank.toLowerCase().includes(lowerCaseQuery) ||
      payee.accountNumberMasked.toLowerCase().includes(lowerCaseQuery)
    );
  });

  return (
    <div
      className={`transfer-modal-recipient-list ${isNewRecipientFormOpen ? "disabled" : ""}`}
    >
      <div className="transfer-modal-input">
        <label>Search payees</label>
        <input
          id="transfer-modal-recipient-list-search-box"
          className="search-box "
          type="text"
          placeholder="Search payees..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={isNewRecipientFormOpen}
        />
      </div>

      {filteredPayees.length > 0 ? (
        <fieldset
          aria-describedby={error ? "payee-error" : undefined}
          className="transfer-modal-recipient-fieldset"
        >
          <table>
            <tbody>
              {filteredPayees.map((payee) => (
                <tr key={payee.id}>
                  <td>
                    <input
                      type="radio"
                      id={`payee-${payee.id}`}
                      name="recipient"
                      value={payee.id}
                      checked={selectedPayeeId === payee.id}
                      onChange={() => setSelectedPayeeId(payee.id)}
                      onBlur={onBlur}
                      disabled={isNewRecipientFormOpen}
                    />
                  </td>
                  <td>
                    <label htmlFor={`payee-${payee.id}`}>
                      {payee.name} - {payee.bank} · {payee.accountNumberMasked}
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {error && (
            <span id="payee-error" className="transfer-modal-field-error">
              {error}
            </span>
          )}
        </fieldset>
      ) : (
        <p className="transfer-modal-recipient-list-no-result">
          No payees found.
        </p>
      )}
    </div>
  );
}
