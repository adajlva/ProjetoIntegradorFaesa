<script setup lang="ts">
interface BaseLabelProps {
  label?: string
  required?: boolean
  htmlFor?: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<BaseLabelProps>(), {
  label: undefined,
  required: false,
  htmlFor: undefined,
  size: 'md',
})

const sizeClasses: Record<string, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
}
</script>

<template>
  <label
    :for="props.htmlFor"
    class="font-sans font-medium text-label-gray"
    :class="sizeClasses[props.size]"
  >
    <slot>{{ props.label }}</slot>
    <span
      v-if="props.required"
      class="text-red-500 text-xs ml-0.5"
      aria-hidden="true"
    >*</span>
  </label>
</template>
