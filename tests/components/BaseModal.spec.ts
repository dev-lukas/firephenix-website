import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseModal from '../../src/components/base/BaseModal.vue';

const mountModal = (
  modelValue: boolean,
  slots: Record<string, string> = {}
) =>
  mount(BaseModal, {
    props: { modelValue },
    slots: {
      title: 'Kanal erstellen',
      default: '<p class="body-copy">Inhalt des Modals</p>',
      ...slots,
    },
  });

describe('BaseModal.vue', () => {
  it('renders nothing while modelValue is false', () => {
    const wrapper = mountModal(false);

    expect(wrapper.find('.modal-backdrop').exists()).toBe(false);
  });

  it('renders title and default slot content when open', () => {
    const wrapper = mountModal(true);

    expect(wrapper.get('.modal-title').text()).toBe('Kanal erstellen');
    expect(wrapper.get('.modal-content .body-copy').text()).toBe(
      'Inhalt des Modals'
    );
  });

  it('omits the footer section when no footer slot is provided', () => {
    const wrapper = mountModal(true);

    expect(wrapper.find('.modal-footer').exists()).toBe(false);
  });

  it('renders the footer section when a footer slot is provided', () => {
    const wrapper = mountModal(true, {
      footer: '<button class="confirm">OK</button>',
    });

    expect(wrapper.get('.modal-footer .confirm').text()).toBe('OK');
  });

  it('emits update:modelValue=false when the close button is clicked', async () => {
    const wrapper = mountModal(true);

    await wrapper.get('.close-button').trigger('click');

    expect(wrapper.emitted('update:modelValue')).toEqual([[false]]);
  });

  it('emits update:modelValue=false when the backdrop is clicked', async () => {
    const wrapper = mountModal(true);

    await wrapper.get('.modal-backdrop').trigger('click');

    expect(wrapper.emitted('update:modelValue')).toEqual([[false]]);
  });

  it('does not close when clicking inside the modal container', async () => {
    const wrapper = mountModal(true);

    await wrapper.get('.modal-container').trigger('click');
    await wrapper.get('.modal-content').trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('opens and closes when the modelValue prop changes', async () => {
    const wrapper = mountModal(false);
    expect(wrapper.find('.modal-container').exists()).toBe(false);

    await wrapper.setProps({ modelValue: true });
    expect(wrapper.find('.modal-container').exists()).toBe(true);

    await wrapper.setProps({ modelValue: false });
    // Transition wrapper: element leaves after the transition, but v-if content
    // must no longer be reachable for interaction assertions.
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.modal-title').exists()).toBe(false);
  });
});
