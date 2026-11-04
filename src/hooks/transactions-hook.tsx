import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api/client";
import type { TransactionsResponse } from "../api/types";

export function useTransactions(searchQuery?: string, limit?: number) {
  const params = new URLSearchParams({
    q: searchQuery ?? "",
    limit: limit?.toString() ?? "8",
  });

  return useQuery({
    queryKey: ["transactions", searchQuery, limit],
    queryFn: () =>
      apiFetch<TransactionsResponse>(`/api/transactions?${params.toString()}`),
    retry: false,
  });
}
