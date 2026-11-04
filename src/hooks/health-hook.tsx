import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api/client";
import type { Health } from "../api/types";

function useHealth() {
  return useQuery({
    queryKey: ["health"],
    queryFn: () => apiFetch<Health>("/api/health"),
    retry: false,
  });
}

export function useHealthStatus() {
  const health = useHealth();
  return health.isPending
    ? "checking…"
    : health.isError
      ? "not connected"
      : "connected";
}
