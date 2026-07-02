import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import TttServerSection from '../../src/components/gameserver/TttServerSection.vue';

const STATUS_URL = '/api/gameservers/ttt/status';
const REFRESH_MS = 30000;

const onlineStatus = {
  status: 'online',
  name: 'FirePhenix TTT',
  current_map: 'ttt_rooftops',
  players: { current: 12, max: 24 },
  visibility: 'private',
  latency_ms: 18,
};

const okJson = (body: unknown) =>
  ({ ok: true, status: 200, json: async () => body }) as Response;

// flushPromises() from test-utils relies on real setTimeout, which is faked
// here, so drain the microtask queue manually instead.
const flushMicrotasks = async () => {
  for (let i = 0; i < 10; i += 1) {
    await Promise.resolve();
  }
};

const mountSection = async () => {
  const wrapper = mount(TttServerSection, {
    global: {
      stubs: { 'font-awesome-icon': true },
    },
  });
  await flushMicrotasks();
  await wrapper.vm.$nextTick();
  return wrapper;
};

describe('TttServerSection.vue', () => {
  let wrapper: VueWrapper | undefined;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('fetches the server status once on mount and renders it', async () => {
    const fetchMock = vi.fn().mockResolvedValue(okJson(onlineStatus));
    vi.stubGlobal('fetch', fetchMock);

    wrapper = await mountSection();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(STATUS_URL);
    expect(wrapper.get('.status-pill').text()).toBe('Online');
    expect(wrapper.get('.status-pill').classes()).toContain('online');
    expect(wrapper.get('.status-header h3').text()).toBe('FirePhenix TTT');
    expect(wrapper.get('.highlight-metric strong').text()).toBe('12/24');
    expect(wrapper.text()).toContain('ttt_rooftops');
    expect(wrapper.text()).toContain('18 ms');
    expect(wrapper.find('.status-error').exists()).toBe(false);
    expect(wrapper.text()).toContain('Zuletzt aktualisiert:');
  });

  it('polls the status endpoint every 30 seconds', async () => {
    const fetchMock = vi.fn().mockResolvedValue(okJson(onlineStatus));
    vi.stubGlobal('fetch', fetchMock);

    wrapper = await mountSection();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(REFRESH_MS);
    expect(fetchMock).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(REFRESH_MS * 2);
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it('stops polling after unmount', async () => {
    const fetchMock = vi.fn().mockResolvedValue(okJson(onlineStatus));
    vi.stubGlobal('fetch', fetchMock);

    wrapper = await mountSection();
    await vi.advanceTimersByTimeAsync(REFRESH_MS);
    expect(fetchMock).toHaveBeenCalledTimes(2);

    wrapper.unmount();
    wrapper = undefined;

    await vi.advanceTimersByTimeAsync(REFRESH_MS * 5);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('shows a German error message and unknown status when fetch rejects', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))
    );

    wrapper = await mountSection();

    expect(wrapper.get('.status-error').text()).toBe(
      'Status konnte nicht geladen werden.'
    );
    expect(wrapper.get('.status-pill').text()).toBe('Unbekannt');
    expect(wrapper.get('.highlight-metric strong').text()).toBe('Keine Daten');
  });

  it('treats a non-ok HTTP response as a load failure', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 502,
        json: async () => ({}),
      } as Response)
    );

    wrapper = await mountSection();

    expect(wrapper.get('.status-error').text()).toBe(
      'Status konnte nicht geladen werden.'
    );
    expect(wrapper.get('.status-pill').text()).toBe('Unbekannt');
  });

  it('surfaces an offline server with a dedicated message', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(okJson({ status: 'offline' }))
    );

    wrapper = await mountSection();

    expect(wrapper.get('.status-pill').text()).toBe('Offline');
    expect(wrapper.get('.status-error').text()).toContain(
      'antwortet aktuell nicht'
    );
  });

  it('recovers from an error once a later poll succeeds', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockResolvedValue(okJson(onlineStatus));
    vi.stubGlobal('fetch', fetchMock);

    wrapper = await mountSection();
    expect(wrapper.find('.status-error').exists()).toBe(true);

    await vi.advanceTimersByTimeAsync(REFRESH_MS);
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.status-error').exists()).toBe(false);
    expect(wrapper.get('.status-pill').text()).toBe('Online');
  });

  it('refetches immediately when the refresh button is clicked', async () => {
    const fetchMock = vi.fn().mockResolvedValue(okJson(onlineStatus));
    vi.stubGlobal('fetch', fetchMock);

    wrapper = await mountSection();
    await wrapper.get('.refresh-button').trigger('click');
    await flushMicrotasks();

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('masks the server password until it is revealed by click', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(okJson(onlineStatus)));
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(window.navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    wrapper = await mountSection();
    expect(wrapper.get('.password-text').text()).toBe('*****');

    await wrapper.get('.password-display').trigger('click');
    await flushMicrotasks();
    await wrapper.vm.$nextTick();

    expect(wrapper.get('.password-text').text()).toBe('ember');
    expect(writeText).toHaveBeenCalledWith('ember');
  });
});
