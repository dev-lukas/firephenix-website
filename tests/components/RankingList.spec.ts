import { afterEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import {
  createMemoryHistory,
  createRouter,
  type Router,
} from 'vue-router';
import RankingList from '../../src/components/ranking/RankingList.vue';

interface RankedPlayer {
  id: number;
  name: string;
  level: number;
  minutes: number;
}

const players: RankedPlayer[] = [
  { id: 11, name: 'Ember', level: 20, minutes: 6000 },
  { id: 12, name: 'Blaze', level: 18, minutes: 4321 },
  { id: 13, name: 'Ash', level: 15, minutes: 3000 },
  { id: 14, name: 'Cinder', level: 25, minutes: 125 },
  { id: 15, name: 'Spark', level: 3, minutes: 59 },
];

const okJson = (body: unknown) =>
  ({ ok: true, status: 200, json: async () => body }) as Response;

const makeRouter = (): Router =>
  createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      {
        path: '/ranking/player-:id',
        component: { template: '<div />' },
      },
    ],
  });

const mountList = async (router: Router) => {
  const wrapper = mount(RankingList, {
    global: {
      plugins: [router],
      stubs: { 'font-awesome-icon': true },
    },
  });
  await flushPromises();
  return wrapper;
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('RankingList.vue', () => {
  it('fetches the all-time ranking on mount and renders podium plus table rows', async () => {
    const fetchMock = vi.fn().mockResolvedValue(okJson(players));
    vi.stubGlobal('fetch', fetchMock);

    const wrapper = await mountList(makeRouter());

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('/api/ranking/top?period=total');

    // Top three players occupy the podium.
    const podiumNames = wrapper
      .findAll('.podium-spot .player-name')
      .map((node) => node.text());
    expect(podiumNames).toEqual(['Blaze', 'Ember', 'Ash']); // second, first, third DOM order
    expect(wrapper.get('.podium-spot.first .player-name').text()).toBe('Ember');

    // Remaining players land in the table, ranked from 4 upwards.
    const rows = wrapper.findAll('.table-row.desktop-only');
    expect(rows).toHaveLength(2);
    expect(rows[0].get('.rank').text()).toBe('4');
    expect(rows[0].text()).toContain('Cinder');
    expect(rows[1].get('.rank').text()).toBe('5');
    expect(rows[1].text()).toContain('Spark');
  });

  it('formats play time as hours and minutes', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(okJson(players)));

    const wrapper = await mountList(makeRouter());

    // 6000 minutes -> 100 Std 0 Min (podium), 59 minutes -> 0 Std 59 Min (table).
    expect(wrapper.get('.podium-spot.first .player-time').text()).toBe(
      '100 Std 0 Min'
    );
    const rows = wrapper.findAll('.table-row.desktop-only');
    expect(rows[1].get('.time').text()).toBe('0 Std 59 Min');
  });

  it('labels levels above 20 as roman prestige and at most 20 as plain level', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(okJson(players)));

    const wrapper = await mountList(makeRouter());
    const rows = wrapper.findAll('.table-row.desktop-only');

    expect(rows[0].text()).toContain('Prestige V'); // level 25 -> 25 - 20 = V
    expect(rows[1].text()).toContain('Level 3');
  });

  it('refetches with the selected period when a period button is clicked', async () => {
    const fetchMock = vi.fn().mockResolvedValue(okJson(players));
    vi.stubGlobal('fetch', fetchMock);

    const wrapper = await mountList(makeRouter());
    const buttons = wrapper.findAll('.ranking-controls button');
    const monthly = buttons.find((b) => b.text() === 'Monatlich');
    expect(monthly).toBeDefined();

    await monthly!.trigger('click');
    await flushPromises();

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenLastCalledWith('/api/ranking/top?period=monthly');
  });

  it('navigates to the player profile when a row is clicked', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(okJson(players)));
    const router = makeRouter();
    const pushSpy = vi.spyOn(router, 'push');

    const wrapper = await mountList(router);
    await wrapper.findAll('.table-row.desktop-only')[0].trigger('click');

    expect(pushSpy).toHaveBeenCalledWith('/ranking/player-14');
  });

  it('renders an empty list without crashing when the API responds non-ok', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        json: async () => ({}),
      } as Response)
    );

    const wrapper = await mountList(makeRouter());

    expect(wrapper.findAll('.podium-spot')).toHaveLength(0);
    expect(wrapper.findAll('.table-row.desktop-only')).toHaveLength(0);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('renders an empty list without crashing when fetch rejects', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))
    );

    const wrapper = await mountList(makeRouter());

    expect(wrapper.findAll('.podium-spot')).toHaveLength(0);
    expect(wrapper.findAll('.table-row.desktop-only')).toHaveLength(0);
    expect(consoleSpy).toHaveBeenCalled();

    // The period switcher stays usable after a failure.
    expect(wrapper.findAll('.ranking-controls button')).toHaveLength(3);
  });
});
