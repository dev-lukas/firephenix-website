import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useAuthStore } from '../../src/services/auth';

const jsonResponse = (body: unknown, ok = true, status = 200) =>
  ({
    ok,
    status,
    json: async () => body,
  }) as Response;

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('starts logged out with no tokens', () => {
    const store = useAuthStore();

    expect(store.isAuthenticated).toBe(false);
    expect(store.isAdmin).toBe(false);
    expect(store.steamId).toBeNull();
    expect(store.csrfToken).toBeNull();
  });

  it('checkAuth() populates the state from a successful auth check', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        authenticated: true,
        steam_id: '76561198000000001',
        csrf_token: 'token-123',
        is_admin: true,
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    const store = useAuthStore();
    const result = await store.checkAuth();

    expect(result).toBe(true);
    expect(store.isAuthenticated).toBe(true);
    expect(store.steamId).toBe('76561198000000001');
    expect(store.csrfToken).toBe('token-123');
    expect(store.isAdmin).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('/api/auth/check', {
      credentials: 'same-origin',
    });
  });

  it('checkAuth() coerces a truthy non-boolean is_admin flag to a boolean', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse({
          authenticated: true,
          steam_id: '1',
          csrf_token: 't',
          is_admin: 1,
        })
      )
    );

    const store = useAuthStore();
    await store.checkAuth();

    expect(store.isAdmin).toBe(true);
  });

  it('checkAuth() resets a previously authenticated session on an unauthenticated response', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse({
          authenticated: true,
          steam_id: '76561198000000001',
          csrf_token: 'token-123',
          is_admin: true,
        })
      )
      .mockResolvedValueOnce(
        jsonResponse({
          authenticated: false,
          steam_id: null,
          csrf_token: null,
          is_admin: false,
        })
      );
    vi.stubGlobal('fetch', fetchMock);

    const store = useAuthStore();
    await store.checkAuth();
    expect(store.isAuthenticated).toBe(true);

    const result = await store.checkAuth();

    expect(result).toBe(false);
    expect(store.isAuthenticated).toBe(false);
    expect(store.steamId).toBeNull();
    expect(store.csrfToken).toBeNull();
    expect(store.isAdmin).toBe(false);
  });

  it('checkAuth() treats a non-ok JSON error body as logged out', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(jsonResponse({ authenticated: false }, false, 401))
    );

    const store = useAuthStore();
    const result = await store.checkAuth();

    expect(result).toBe(false);
    expect(store.isAuthenticated).toBe(false);
    expect(store.isAdmin).toBe(false);
    expect(store.csrfToken).toBeUndefined();
  });

  it('checkAuth() propagates a network failure and leaves the state logged out', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))
    );

    const store = useAuthStore();

    // The store does not catch network errors itself; callers see the rejection,
    // and the state must remain in its logged-out defaults.
    await expect(store.checkAuth()).rejects.toThrow('Failed to fetch');
    expect(store.isAuthenticated).toBe(false);
    expect(store.isAdmin).toBe(false);
    expect(store.steamId).toBeNull();
    expect(store.csrfToken).toBeNull();
  });

  it('csrfHeaders() returns the CSRF header when a token is present', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse({
          authenticated: true,
          steam_id: '1',
          csrf_token: 'csrf-abc',
          is_admin: false,
        })
      )
    );

    const store = useAuthStore();
    await store.checkAuth();

    expect(store.csrfHeaders()).toEqual({ 'X-CSRF-Token': 'csrf-abc' });
  });

  it('csrfHeaders() returns an empty object when no token is set', () => {
    const store = useAuthStore();

    expect(store.csrfHeaders()).toEqual({});
  });
});
