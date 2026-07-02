import { describe, expect, it } from 'vitest';
import { isRef, watch, nextTick } from 'vue';
import { useErrorHandling } from '../../src/composables/useErrorHandling';

describe('useErrorHandling', () => {
  it('starts with no error and loading=false', () => {
    const { error, loading } = useErrorHandling();

    expect(isRef(error)).toBe(true);
    expect(isRef(loading)).toBe(true);
    expect(error.value).toBeNull();
    expect(loading.value).toBe(false);
  });

  it('handleError() stores a plain string as the message without details', () => {
    const { error, handleError } = useErrorHandling();

    handleError('Etwas ist schiefgelaufen');

    expect(error.value).toEqual({
      message: 'Etwas ist schiefgelaufen',
      details: undefined,
    });
  });

  it('handleError() extracts the message from an Error and keeps it as details', () => {
    const { error, handleError } = useErrorHandling();
    const cause = new Error('HTTP 500');

    handleError(cause);

    expect(error.value?.message).toBe('HTTP 500');
    expect(error.value?.details).toBe(cause);
  });

  it('handleError() replaces a previous error instead of accumulating', () => {
    const { error, handleError } = useErrorHandling();

    handleError('first');
    handleError(new Error('second'));

    expect(error.value?.message).toBe('second');
  });

  it('clearError() resets the error to null', () => {
    const { error, handleError, clearError } = useErrorHandling();

    handleError('boom');
    expect(error.value).not.toBeNull();

    clearError();
    expect(error.value).toBeNull();
  });

  it('clearError() is safe to call when no error is set', () => {
    const { error, clearError } = useErrorHandling();

    expect(() => clearError()).not.toThrow();
    expect(error.value).toBeNull();
  });

  it('error state is reactive and observable by watchers', async () => {
    const { error, handleError, clearError } = useErrorHandling();
    const seen: Array<string | null> = [];
    watch(error, (value) => seen.push(value ? value.message : null));

    handleError('sichtbar');
    await nextTick();
    clearError();
    await nextTick();

    expect(seen).toEqual(['sichtbar', null]);
  });

  it('separate invocations produce independent state', () => {
    const first = useErrorHandling();
    const second = useErrorHandling();

    first.handleError('nur hier');
    first.loading.value = true;

    expect(second.error.value).toBeNull();
    expect(second.loading.value).toBe(false);
  });
});
