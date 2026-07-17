import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import Login from '../../src/components/profile/Login.vue';
import CookieBanner from '../../src/components/base/CookieBanner.vue';

const consent = (functional: boolean) => ({
  essential: true,
  analytics: false,
  functional,
  timestamp: Date.now(),
});

const mountLogin = () =>
  mount(Login, {
    global: {
      stubs: {
        'font-awesome-icon': true,
        'router-link': true,
        CookieBanner: true,
      },
    },
  });

describe('Login.vue cookie-consent gating', () => {
  let wrapper: VueWrapper;
  let initialHref: string;

  beforeEach(() => {
    localStorage.clear();
    initialHref = window.location.href;
  });

  afterEach(() => {
    wrapper?.unmount();
  });

  it('renders the Steam login button disabled before any consent is given', () => {
    wrapper = mountLogin();
    const button = wrapper.get('button.steam-login-button');

    expect(button.attributes('disabled')).toBeDefined();
    expect(button.classes()).toContain('button-disabled');
    expect(wrapper.text()).toContain(
      'Bitte akzeptiere Cookies, um dich einzuloggen.'
    );
  });

  it('does not redirect when clicked without consent', async () => {
    wrapper = mountLogin();

    await wrapper.get('button.steam-login-button').trigger('click');

    expect(window.location.href).toBe(initialHref);
  });

  it('enables login once functional cookie consent is granted', async () => {
    wrapper = mountLogin();

    wrapper.getComponent(CookieBanner).vm.$emit('consent-changed', consent(true));
    await wrapper.vm.$nextTick();

    const button = wrapper.get('button.steam-login-button');
    expect(button.attributes('disabled')).toBeUndefined();
    expect(button.classes()).not.toContain('button-disabled');
    expect(wrapper.text()).toContain(
      'Dies wird dich zu Steams Login-Seite weiterleiten.'
    );
  });

  it('redirects to /api/auth on click after consent', async () => {
    wrapper = mountLogin();

    wrapper.getComponent(CookieBanner).vm.$emit('consent-changed', consent(true));
    await wrapper.vm.$nextTick();
    await wrapper.get('button.steam-login-button').trigger('click');

    expect(window.location.href).toContain('/api/auth');
  });

  it('disables login again when functional consent is revoked', async () => {
    wrapper = mountLogin();

    wrapper.getComponent(CookieBanner).vm.$emit('consent-changed', consent(true));
    await wrapper.vm.$nextTick();
    wrapper.getComponent(CookieBanner).vm.$emit('consent-changed', consent(false));
    await wrapper.vm.$nextTick();

    const button = wrapper.get('button.steam-login-button');
    expect(button.attributes('disabled')).toBeDefined();
    expect(button.classes()).toContain('button-disabled');
  });
});
