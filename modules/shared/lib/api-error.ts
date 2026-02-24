import type { ApiResponse } from "@/modules/shared/types/api-types";
import { isAxiosError } from "axios";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

/** Extrai a mensagem de erro da resposta da API. */
export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError<ApiResponse>(error)) {
    return error.response?.data?.message || "An unexpected error occurred";
  }
  return "An unexpected error occurred";
}

/** Aplica erros de validação 422 do backend no react-hook-form. */
export function applyValidationErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
): void {
  if (!isAxiosError<ApiResponse>(error)) return;
  const response = error.response;
  if (response?.status !== 422) return;

  const fieldErrors = response.data?.errors;
  if (!fieldErrors) return;

  for (const [field, messages] of Object.entries(fieldErrors)) {
    if (Array.isArray(messages) && messages.length > 0) {
      setError(field as Path<T>, {
        type: "server",
        message: messages[0],
      });
    }
  }
}
