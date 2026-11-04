import { useMutation } from "@tanstack/react-query";
import { apiFetch, ApiError } from "../api/client";
import type { CreateTransferRequest, TransferResponse } from "../api/types";

export function useCreateTransfer() {
  return useMutation<TransferResponse, ApiError, CreateTransferRequest>({
    mutationFn: (requestBody: CreateTransferRequest) =>
      apiFetch<TransferResponse>("/api/transfers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      }),
  });
}
