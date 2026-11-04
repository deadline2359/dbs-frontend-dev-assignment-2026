import { z } from "zod";
import { formatMoney } from "../../lib/format";

export const transferValidationSchema = (
  balance: number,
  remainingLimit: number,
) =>
  z
    .object({
      isNewRecipient: z.boolean(),
      payeeId: z.string(),
      name: z.string(),
      accountNumber: z.string(),
      bank: z.string(),
      amount: z.number({
        error: `Enter an amount of at least ${formatMoney(1.0)} with at most 2 decimal places.`,
      }),
      note: z.string(),
    })
    .superRefine((value, context) => {
      if (value.isNewRecipient) {
        const name = value.name.trim();
        if (name.length < 2 || name.length > 50) {
          context.addIssue({
            code: "custom",
            path: ["name"],
            message: "Enter a recipient name between 2 and 50 characters.",
          });
        }
        if (!/^\d{8}$/.test(value.accountNumber)) {
          context.addIssue({
            code: "custom",
            path: ["accountNumber"],
            message: "Enter a valid 8-digit account number.",
          });
        }
        if (!value.bank) {
          context.addIssue({
            code: "custom",
            path: ["bank"],
            message: "Select a bank.",
          });
        }
      } else if (!value.payeeId) {
        context.addIssue({
          code: "custom",
          path: ["payeeId"],
          message: "Choose a recipient.",
        });
      }

      if (
        !Number.isFinite(value.amount) ||
        value.amount < 1 ||
        value.amount.toString().split(".")[1]?.length > 2
      ) {
        context.addIssue({
          code: "custom",
          path: ["amount"],
          message:
            `Enter an amount of at least ${formatMoney(1.0)} with at most 2 decimal places.`,
        });
      } else if (value.amount > balance) {
        context.addIssue({
          code: "custom",
          path: ["amount"],
          message: `Amount can't be more than your available balance (${formatMoney(balance)}).`,
        });
      } else if (value.amount > remainingLimit) {
        context.addIssue({
          code: "custom",
          path: ["amount"],
          message: `This transfer exceeds your remaining daily limit (${formatMoney(remainingLimit)}).`,
        });
      }

      if (value.note.length > 50) {
        context.addIssue({
          code: "custom",
          path: ["note"],
          message: "Enter 50 characters or fewer.",
        });
      }
    });

export type TransferValidationField =
  | "name"
  | "accountNumber"
  | "bank"
  | "payeeId"
  | "amount"
  | "note";

export type TransferValidationErrors = Partial<
  Record<TransferValidationField, string>
>;

const fields = [
  "name",
  "accountNumber",
  "bank",
  "payeeId",
  "amount",
  "note",
] as const;

export function getTransferValidationErrors(
  result: ReturnType<ReturnType<typeof transferValidationSchema>["safeParse"]>,
): TransferValidationErrors {
  if (result.success) return {};

  return result.error.issues.reduce<TransferValidationErrors>(
    (errors, issue) => {
      const field = issue.path[0] as TransferValidationField;
      if (fields.includes(field)) {
        errors[field] ??= issue.message;
      }
      return errors;
    },
    {},
  );
}
