import type { Account } from "./api/types";

export function capitaliseFirstLetter(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function filterForDepositAccounts(accounts: Account[]): Account[] {
  return accounts.filter(
    (account) => account.type === "checking" || account.type === "savings",
  );
}

export function getRemainingTransferLimit(
  transferredToday: number,
  dailyTransferLimit: number,
): number {
  return dailyTransferLimit - transferredToday;
}

export function hideBalance(
  balance: string,
  isBalanceVisible: boolean,
): string {
  return isBalanceVisible ? balance : "••••••";
}
