import { usePayees } from "../../hooks/payees-hook";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import TransferModalRecipientStep from "./transfer-modal-recipient-step";
import TransferModalAmountStep from "./transfer-modal-amount-step";
import type { Account, Customer, CreateTransferRequest } from "../../api/types";
import { useCreateTransfer } from "../../hooks/transfers-hook";
import TransferModalReview from "./transfer-modal-review";
import TransferModalSuccess from "./transfer-modal-success";
import TransferModalFooter from "./transfer-modal-footer";
import TransferModalStepper from "./transfer-modal-stepper";
import DiscardTransferDialog from "./discard-transfer-dialog";
import {
  focusFirstInvalidField,
  validateTransferFields,
  validateTransferStep,
  type TransferFormValues,
} from "./transfer-validation-helpers";
import type {
  TransferValidationErrors,
  TransferValidationField,
} from "./transfer-validation";
import "./transfer-modal-styling.css";

export interface NewRecipient {
  name: string;
  accountNumber: string;
  bank: string;
}

export default function TransferModal({
  customer,
  accounts,
  setIsTransferModalOpen,
}: {
  customer: Customer;
  accounts: Account[];
  setIsTransferModalOpen: (isOpen: boolean) => void;
}) {
  const {
    data: payeesData,
    isPending: isPayeesPending,
    isError: isPayeesError,
  } = usePayees();
  const [currentStep, setCurrentStep] = useState(1);
  const [isNewRecipientFormOpen, setIsNewRecipientFormOpen] = useState(false);
  const [newRecipient, setNewRecipient] = useState<NewRecipient>({
    name: "",
    accountNumber: "",
    bank: "",
  });
  const [amount, setAmount] = useState(0.0);
  const [accountId, setAccountId] = useState<string>(accounts[0]?.id);
  const [note, setNote] = useState("");
  const [selectedPayeeId, setSelectedPayeeId] = useState("");
  const [validationErrors, setValidationErrors] =
    useState<TransferValidationErrors>({});
  const [completedTransfer, setCompletedTransfer] = useState<
    { reference: string } | undefined
  >();
  const [isDiscardConfirmationOpen, setIsDiscardConfirmationOpen] =
    useState(false);
  const createTransfer = useCreateTransfer();
  const queryClient = useQueryClient();

  // helper function to close modal and reset state
  const resetState = () => {
    setCurrentStep(1);
    setIsNewRecipientFormOpen(false);
    setNewRecipient({ name: "", accountNumber: "", bank: "" });
    setSelectedPayeeId("");
    setAmount(0);
    setNote("");
    setCompletedTransfer(undefined);
    setValidationErrors({});
    setIsDiscardConfirmationOpen(false);
  };

  const closeModal = (userAgree = false) => {
    const hasTransferDetails =
      Boolean(selectedPayeeId) ||
      isNewRecipientFormOpen ||
      Boolean(
        newRecipient.name || newRecipient.accountNumber || newRecipient.bank,
      ) ||
      amount > 0 ||
      Boolean(note);

    if (hasTransferDetails && !userAgree) {
      setIsDiscardConfirmationOpen(true);
      return;
    }

    setIsTransferModalOpen(false);
    resetState();
  };

  // sort payees by last used, most recent first
  const payees = [...(payeesData?.payees || [])].sort(
    (a, b) =>
      new Date(b.lastUsedAt).getTime() - new Date(a.lastUsedAt).getTime(),
  );

  const selectedPayee = payees.find((payee) => payee.id === selectedPayeeId);
  const recipientName = selectedPayee?.name || newRecipient.name;
  const recipientBank = selectedPayee?.bank || newRecipient.bank;
  const recipientAccount =
    selectedPayee?.accountNumberMasked || newRecipient.accountNumber;
  const selectedAccount = accounts.find((account) => account.id === accountId);
  const transferRequest: CreateTransferRequest = {
    fromAccountId: accountId,
    amount,
    note,
    ...(isNewRecipientFormOpen
      ? { recipient: newRecipient }
      : { payeeId: selectedPayeeId }),
  };

  const transferForm: TransferFormValues = {
    isNewRecipient: isNewRecipientFormOpen,
    payeeId: selectedPayeeId,
    name: newRecipient.name,
    accountNumber: newRecipient.accountNumber,
    bank: newRecipient.bank,
    amount,
    note,
  };
  const validateCurrentStep = (step: number) => {
    return validateTransferStep(
      transferForm,
      selectedAccount?.balance ?? 0,
      customer.dailyTransferLimit - customer.transferredToday,
      step,
    );
  };

  const validateFields = (fields: TransferValidationField[]) => {
    setValidationErrors((current) =>
      validateTransferFields(
        transferForm,
        selectedAccount?.balance ?? 0,
        customer.dailyTransferLimit - customer.transferredToday,
        fields,
        current,
      ),
    );
  };

  const handleConfirmTransfer = () => {
    if (Object.keys(validateCurrentStep(3)).length > 0) return;

    createTransfer.mutate(transferRequest, {
      onSuccess: async (response) => {
        await Promise.all([
          queryClient.refetchQueries({ queryKey: ["customer"] }),
          queryClient.refetchQueries({ queryKey: ["accounts"] }),
          queryClient.refetchQueries({ queryKey: ["transactions"] }),
        ]);

        setCompletedTransfer({
          reference: response.transfer.reference,
        });
      },
    });
  };

  return (
    <div className="transfer-modal-overlay">
      <div className="transfer-modal">
        {completedTransfer ? (
          <TransferModalSuccess
            amount={amount}
            recipientName={recipientName}
            recipientBank={recipientBank}
            recipientAccount={recipientAccount}
            reference={completedTransfer.reference}
            onBackToDashboard={() => closeModal(true)}
            onMakeAnotherTransfer={resetState}
          />
        ) : (
          <>
            <div className="transfer-modal-header">
              <h2>New Transfer</h2>
              <button
                className="transfer-modal-close-btn"
                type="button"
                onClick={() => closeModal()}
              >
                ×
              </button>
            </div>
            <TransferModalStepper currentStep={currentStep} />

            <div className="transfer-modal-content">
              {isPayeesPending ? (
                <span className="transfer-modal-info-text">
                  Loading payees...
                </span>
              ) : isPayeesError ? (
                <span className="transfer-modal-info-text">
                  Error loading payees
                </span>
              ) : (
                (() => {
                  switch (currentStep) {
                    case 1:
                      return (
                        <TransferModalRecipientStep
                          payees={payees}
                          isNewRecipientFormOpen={isNewRecipientFormOpen}
                          setIsNewRecipientFormOpen={setIsNewRecipientFormOpen}
                          newRecipient={newRecipient}
                          setNewRecipient={setNewRecipient}
                          selectedPayeeId={selectedPayeeId}
                          setSelectedPayeeId={setSelectedPayeeId}
                          errors={validationErrors}
                          onBlur={(field) => validateFields([field])}
                        />
                      );
                    case 2:
                      return (
                        <TransferModalAmountStep
                          customer={customer}
                          accounts={accounts}
                          amount={amount}
                          accountId={accountId}
                          setAccountId={setAccountId}
                          setAmount={setAmount}
                          note={note}
                          setNote={setNote}
                          errors={validationErrors}
                          onBlur={(field) => validateFields([field])}
                        />
                      );
                    default:
                      return (
                        <TransferModalReview
                          account={selectedAccount}
                          recipientName={recipientName}
                          recipientBank={recipientBank}
                          recipientAccount={recipientAccount}
                          amount={amount}
                          note={note}
                          errorFields={
                            createTransfer.isError
                              ? createTransfer.error.fields
                              : undefined
                          }
                        />
                      );
                  }
                })()
              )}
            </div>
            <TransferModalFooter
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              isSending={createTransfer.isPending}
              onCancel={() => closeModal()}
              isContinueDisabled={isPayeesPending || isPayeesError}
              onContinue={() => {
                const errors = validateCurrentStep(currentStep);
                if (Object.keys(errors).length === 0) {
                  setCurrentStep(currentStep + 1);
                } else {
                  setValidationErrors((current) => ({
                    ...current,
                    ...errors,
                  }));
                  focusFirstInvalidField(
                    Object.keys(errors) as TransferValidationField[],
                  );
                }
              }}
              onConfirm={handleConfirmTransfer}
            />
          </>
        )}
      </div>
      {isDiscardConfirmationOpen && (
        <DiscardTransferDialog
          onKeepEditing={() => setIsDiscardConfirmationOpen(false)}
          onDiscard={() => closeModal(true)}
        />
      )}
    </div>
  );
}
