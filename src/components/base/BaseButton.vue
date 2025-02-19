<template>
  <button
    class="base-button"
    :class="{
      primary: variant === 'primary',
      secondary: variant === 'secondary',
      disabled: disabled,
      small: size === 'small',
      medium: size === 'medium',
      large: size === 'large',
      'full-width': fullWidth,
    }"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <span v-if="glow" class="button-glow"></span>
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  glow?: boolean;
  fullWidth?: boolean;
}>();

defineEmits<{
  (e: 'click'): void;
}>();
</script>

<style scoped>
.base-button {
  position: relative;
  background: var(--clr-surface-elevated-1);
  border: 1px solid var(--clr-border);
  color: var(--clr-text-primary);
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.base-button:hover:not(.disabled) {
  background: var(--clr-primary-transparent);
  border-color: var(--clr-primary);
  transform: translateY(-2px);
}

.primary {
  background: var(--clr-primary);
  border-color: var(--clr-primary);
  box-shadow: 0 4px 12px var(--clr-primary-transparent);
}

.secondary {
  background: var(--clr-surface-elevated-1);
  border: 1px solid var(--clr-border);
}

.small {
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
}

.medium {
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
}

.large {
  padding: 1rem 2rem;
  font-size: 1.1rem;
}

.full-width {
  width: 100%;
}

.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    var(--clr-primary-transparent),
    transparent
  );
  transition: 0.5s;
}

.base-button:hover:not(.disabled) .button-glow {
  left: 100%;
}
</style>
