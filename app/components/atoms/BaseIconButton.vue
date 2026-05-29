<script setup lang="ts">
import { computed } from 'vue'
import BaseIcon from './BaseIcon.vue'

interface BaseIconButtonProps {
  icon: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'primary' | 'primary-fill' | 'primary-outline' | 'danger' | 'danger-fill' | 'danger-outline' | 'outline' | 'ghost'
  disabled?: boolean
  ariaLabel: string
}

const props = withDefaults(defineProps<BaseIconButtonProps>(), {
  size: 'md',
  variant: 'default',
  disabled: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const sizeClasses = computed(() => {
  const sizes: Record<string, string> = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  }
  return sizes[props.size] || sizes.md
})

const iconSize = computed(() => {
  const sizes: Record<string, number> = {
    sm: 14,
    md: 18,
    lg: 22,
  }
  return sizes[props.size] || sizes.md
})

const variantClasses = computed(() => {
  const variants: Record<string, string> = {
    default: 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200',
    primary: 'bg-transparent text-[#4a7f34] hover:bg-[#4a7f34]/10 active:bg-[#4a7f34]/20',
    'primary-fill': 'bg-[#4a7f34] text-white hover:bg-[#3d6b2b] active:bg-[#335a24]',
    'primary-outline': 'bg-transparent text-[#4a7f34] border border-[#4a7f34] hover:bg-[#4a7f34]/10 active:bg-[#4a7f34]/20',
    danger: 'bg-transparent text-[#bc191c] hover:bg-[#bc191c]/10 active:bg-[#bc191c]/20',
    'danger-fill': 'bg-[#bc191c] text-white hover:bg-[#a01517] active:bg-[#871113]',
    'danger-outline': 'bg-transparent text-[#bc191c] border border-[#bc191c] hover:bg-[#bc191c]/10 active:bg-[#bc191c]/20',
    outline: 'bg-transparent text-gray-700 border border-[#d1d1d1] hover:bg-gray-50 active:bg-gray-100',
    ghost: 'bg-transparent text-gray-500 hover:bg-gray-100 active:bg-gray-200',
  }
  return variants[props.variant] || variants.default
})

const disabledClasses = computed(() => {
  if (props.disabled) {
    return 'opacity-50 cursor-not-allowed pointer-events-none'
  }
  return 'cursor-pointer'
})

const buttonClasses = computed(() => [
  'inline-flex items-center justify-center rounded-lg',
  'transition-colors duration-150',
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50',
  sizeClasses.value,
  variantClasses.value,
  disabledClasses.value,
])

function handleClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault()
    event.stopPropagation()
    return
  }
  emit('click', event)
}
</script>

<template>
  <button
    type="button"
    :class="buttonClasses"
    :aria-label="props.ariaLabel"
    :aria-disabled="props.disabled || undefined"
    :disabled="props.disabled"
    @click="handleClick"
  >
    <BaseIcon :name="props.icon" :size="iconSize" />
  </button>
</template>
