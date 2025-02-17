import { ref } from 'vue';
import type { Ref } from 'vue';

export interface ErrorState {
  message: string;
  code?: string;
  details?: unknown;
}

export function useErrorHandling() {
  const error: Ref<ErrorState | null> = ref(null);
  const loading: Ref<boolean> = ref(false);

  const handleError = (e: Error | string) => {
    error.value = {
      message: typeof e === 'string' ? e : e.message,
      details: e instanceof Error ? e : undefined,
    };
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    error,
    loading,
    handleError,
    clearError,
  };
}
