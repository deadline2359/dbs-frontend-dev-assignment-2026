import { abbreviatedBankNames } from "../../constants";
import type { NewRecipient } from "./transfer-modal";
import TransferModalInput from "./transfer-modal-input";

export default function TransferModalNewRecipientForm({
  setIsNewRecipientFormOpen,
  isNewRecipientFormOpen,
  newRecipient,
  setNewRecipient,
  errors,
  onBlur,
}: {
  setIsNewRecipientFormOpen: (isOpen: boolean) => void;
  isNewRecipientFormOpen: boolean;
  newRecipient: NewRecipient;
  setNewRecipient: (recipient: NewRecipient) => void;
  errors: Partial<Record<keyof NewRecipient, string>>;
  onBlur: (field: "name" | "accountNumber" | "bank") => void;
}) {
  const updateRecipientField = (field: keyof NewRecipient, value: string) => {
    setNewRecipient({ ...newRecipient, [field]: value });
  };

  return (
    <div className="transfer-modal-new-recipient">
      <button
        className="transfer-modal-new-recipient-btn"
        type="button"
        onClick={() => setIsNewRecipientFormOpen(!isNewRecipientFormOpen)}
      >
        {isNewRecipientFormOpen ? "- Close form" : "+ Send to someone new"}
      </button>
      {isNewRecipientFormOpen && (
        <div className="transfer-modal-new-recipient-form">
          <TransferModalInput
            fieldLabel="Recipient name"
            fieldId="recipient-name"
            value={newRecipient.name}
            error={errors.name}
            onBlur={() => onBlur("name")}
            onChange={(value) => updateRecipientField("name", value)}
          />
          <TransferModalInput
            fieldLabel="Account number"
            fieldId="recipient-account-number"
            value={newRecipient.accountNumber}
            error={errors.accountNumber}
            onBlur={() => onBlur("accountNumber")}
            onChange={(value) => updateRecipientField("accountNumber", value)}
          />
          <div className="transfer-modal-input">
            <label htmlFor="recipient-bank">Bank</label>
            <select
              id="recipient-bank"
              value={newRecipient.bank}
              aria-describedby={errors.bank ? "recipient-bank-error" : undefined}
              onBlur={() => onBlur("bank")}
              onChange={(e) => updateRecipientField("bank", e.target.value)}
            >
              <option value="" disabled>
                Select a bank
              </option>
              {abbreviatedBankNames.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
            {errors.bank && (
              <span id="recipient-bank-error" className="transfer-modal-field-error">
                {errors.bank}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
