<template>
    <label class="base-switch" :class="{ 'is-disabled': disabled }">
      <input
        type="checkbox"
        :checked="modelValue"
        :disabled="disabled"
        @change="handleChange"
        class="switch-input"
      />
      <span class="switch-slider"></span>
    </label>
  </template>
  
  <script setup lang="ts">
  interface Props {
    modelValue: boolean;
    disabled?: boolean;
  }
  
  defineProps<Props>();
  const emit = defineEmits(['update:modelValue']);
  
  const handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.checked);
  };
  </script>
  
  <style scoped>
  .base-switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 28px; 
    cursor: pointer;
    user-select: none;
  }
  
  .switch-input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .switch-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--clr-surface-3); 
    border: 1px solid var(--clr-border);
    transition: 0.3s;
    border-radius: 34px;
  }
  

  .switch-slider:before {
    position: absolute;
    content: "";
    height: 20px; 
    width: 20px;
    left: 3px; 
    bottom: 3px;
    background-color: var(--clr-text-secondary); 
    transition: 0.3s;
    border-radius: 50%;
  }
  
  .switch-input:checked + .switch-slider {
    background-color: var(--clr-primary); 
    border-color: var(--clr-primary);
  }
  
  .switch-input:focus + .switch-slider {
   box-shadow: 0 0 0 2px var(--clr-primary-transparent); 
  }
  

  .switch-input:checked + .switch-slider:before {
    transform: translateX(22px); 
    background-color: white; 
  }
  
  .base-switch.is-disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  .base-switch.is-disabled .switch-slider {
    cursor: not-allowed;
  }
  </style>