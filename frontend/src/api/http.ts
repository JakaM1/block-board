import axios, { AxiosError } from 'axios'

/**
 * Axios s sejnim piškotkom in žetonom CSRF (Laravel Sanctum).
 * Privzeto gredo zahteve na isti izvor, Vite jih lokalno posreduje API-ju.
 */
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/',
  withCredentials: true,
  withXSRFToken: true,
  headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
})

export async function csrf(): Promise<void> {
  await http.get('/sanctum/csrf-cookie')
}

export type ValidationErrors = Record<string, string[]>

/** Napake validacije (422) iz odgovora API-ja. */
export function validationErrors(error: unknown): ValidationErrors {
  if (error instanceof AxiosError && error.response?.status === 422) {
    return (error.response.data?.errors ?? {}) as ValidationErrors
  }
  return {}
}

/** Uporabniku prijazno sporočilo napake. */
export function errorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message ?? 'Prišlo je do napake. Poskusite znova.'
  }
  return 'Prišlo je do napake. Poskusite znova.'
}
