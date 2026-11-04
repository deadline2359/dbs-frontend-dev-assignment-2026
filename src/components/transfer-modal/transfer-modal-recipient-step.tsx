import TransferModalNewRecipientForm from "./transfer-modal-new-recipient";
import TransferModalRecipientList from "./transfer-modal-recipient-list";
import type { Payee } from "../../api/types";
import type { NewRecipient } from "./transfer-modal";

export default function TransferModalRecipientStep({
  payees,
  isNewRecipientFormOpen,
  setIsNewRecipientFormOpen,
  newRecipient,
  setNewRecipient,
  selectedPayeeId,
  setSelectedPayeeId,
  errors,
  onBlur,
}: {
  payees: Payee[];
  isNewRecipientFormOpen: boolean;
  setIsNewRecipientFormOpen: (isOpen: boolean) => void;
  newRecipient: NewRecipient;
  setNewRecipient: (recipient: NewRecipient) => void;
  selectedPayeeId: string;
  setSelectedPayeeId: (payeeId: string) => void;
  errors: Partial<Record<keyof NewRecipient, string>> & { payeeId?: string };
  onBlur: (field: "name" | "accountNumber" | "bank" | "payeeId") => void;
}) {
  return (
    <div>
      <h3>Who are you sending to?</h3>
      <div className="transfer-modal-step">
        <TransferModalRecipientList
          payees={payees}
          isNewRecipientFormOpen={isNewRecipientFormOpen}
          selectedPayeeId={selectedPayeeId}
          setSelectedPayeeId={setSelectedPayeeId}
          error={errors.payeeId}
          onBlur={() => onBlur("payeeId")}
        />
        <TransferModalNewRecipientForm
          setIsNewRecipientFormOpen={setIsNewRecipientFormOpen}
          isNewRecipientFormOpen={isNewRecipientFormOpen}
          newRecipient={newRecipient}
          setNewRecipient={setNewRecipient}
          errors={errors}
          onBlur={onBlur}
        />
      </div>
    </div>
  );
}
