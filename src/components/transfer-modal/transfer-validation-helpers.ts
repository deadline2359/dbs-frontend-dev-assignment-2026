import {
  getTransferValidationErrors,
  transferValidationSchema,
  type TransferValidationErrors,
  type TransferValidationField,
} from "./transfer-validation";

export interface TransferFormValues {
  isNewRecipient: boolean;
  payeeId: string;
  name: string;
  accountNumber: string;
  bank: string;
  amount: number;
  note: string;
}

const fieldsForStep: Record<number, TransferValidationField[]> = {
  1: ["name", "accountNumber", "bank", "payeeId"],
  2: ["amount", "note"],
  3: ["name", "accountNumber", "bank", "payeeId", "amount", "note"],
};

export function validateTransferStep(
  form: TransferFormValues,
  balance: number,
  remainingLimit: number,
  step: number,
): TransferValidationErrors {
  const errors = getTransferValidationErrors(
    transferValidationSchema(balance, remainingLimit).safeParse(form),
  );
  const fields = new Set(fieldsForStep[step] ?? []);

  return Object.fromEntries(
    Object.entries(errors).filter(([field]) =>
      fields.has(field as TransferValidationField),
    ),
  ) as TransferValidationErrors;
}

export function validateTransferFields(
  form: TransferFormValues,
  balance: number,
  remainingLimit: number,
  fields: TransferValidationField[],
  currentErrors: TransferValidationErrors,
): TransferValidationErrors {
  const errors = getTransferValidationErrors(
    transferValidationSchema(balance, remainingLimit).safeParse(form),
  );
  const nextErrors = { ...currentErrors };

  fields.forEach((field) => {
    delete nextErrors[field];
    if (errors[field]) nextErrors[field] = errors[field];
  });

  return nextErrors;
}

export function focusFirstInvalidField(
  fields: TransferValidationField[],
): void {
  const fieldOrder: TransferValidationField[] = [
    "name",
    "accountNumber",
    "bank",
    "payeeId",
    "amount",
    "note",
  ];
  const ids: Record<TransferValidationField, string> = {
    name: "recipient-name",
    accountNumber: "recipient-account-number",
    bank: "recipient-bank",
    payeeId: "transfer-modal-recipient-list-search-box",
    amount: "amount-field",
    note: "note-field",
  };
  const firstInvalid = fieldOrder.find((field) => fields.includes(field));

  if (firstInvalid) {
    window.requestAnimationFrame(() => {
      document.getElementById(ids[firstInvalid])?.focus();
    });
  }
}
