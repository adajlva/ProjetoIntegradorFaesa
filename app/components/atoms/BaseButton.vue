<script setup lang="ts">
import { computed, useSlots, type Component } from 'vue'

interface BaseButtonProps {
  variant?: 'primary' | 'primary-outline' | 'secondary' | 'secondary-outline' | 'danger' | 'danger-outline' | 'outline' | 'ghost' | 'link'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  as?: string | Component
  ariaLabel?: string
}

const props = withDefaults(defineProps<BaseButtonProps>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button',
  as: 'button',
  ariaLabel: undefined,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const slots = useSlots()

const isDisabled = computed(() => props.disabled || props.loading)

const isIconOnly = computed(() => {
  const hasDefault = !!slots.default
  const hasIcon = !!slots['icon-left'] || !!slots['icon-right']
  return !hasDefault && hasIcon
})

const variantClasses = computed(() => {
  const variants: Record<string, string> = {
    primary:
      'bg-[#4a7f34] text-white hover:bg-[#3d6b2b] active:bg-[#335a24] focus-visible:ring-[#4a7f34]/50',
    'primary-outline':
      'border border-[#4a7f34] text-[#4a7f34] bg-transparent hover:bg-[#4a7f34]/10 active:bg-[#4a7f34]/20 focus-visible:ring-[#4a7f34]/50',
    secondary:
      'bg-[#6b7280] text-white hover:bg-[#4b5563] active:bg-[#374151] focus-visible:ring-[#6b7280]/50',
    'secondary-outline':
      'border border-[#6b7280] text-[#6b7280] bg-transparent hover:bg-[#6b7280]/10 active:bg-[#6b7280]/20 focus-visible:ring-[#6b7280]/50',
    danger:
      'bg-[#bc191c] text-white hover:bg-[#a01517] active:bg-[#871113] focus-visible:ring-[#bc191c]/50',
    'danger-outline':
      'border border-[#bc191c] text-[#bc191c] bg-transparent hover:bg-[#bc191c]/10 active:bg-[#bc191c]/20 focus-visible:ring-[#bc191c]/50',
    outline:
      'border border-[#d1d1d1] text-gray-700 bg-transparent hover:bg-gray-50 active:bg-gray-100 focus-visible:ring-gray-400/50',
    ghost:
      'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus-visible:ring-gray-400/50',
    link:
      'bg-transparent text-[#4a7f34] underline-offset-4 hover:underline active:text-[#335a24] focus-visible:ring-[#4a7f34]/50 !px-0 !py-0',
  }
  return variants[props.variant] || variants.primary
})

const sizeClasses = computed(() => {
  if (isIconOnly.value) {
    const iconSizes: Record<string, string> = {
      sm: 'p-1.5 text-xs',
      md: 'p-2.5 text-sm',
      lg: 'p-3.5 text-base',
    }
    return iconSizes[props.size] || iconSizes.md
  }

  const sizes: Record<string, string> = {
    sm: 'px-2 py-1.5 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2.5 text-base',
  }
  return sizes[props.size] || sizes.md
})

const disabledClasses = computed(() => {
  if (isDisabled.value) {
    return 'opacity-50 cursor-not-allowed pointer-events-none'
  }
  return 'cursor-pointer'
})

const buttonClasses = computed(() => [
  'relative inline-flex items-center justify-center gap-2 rounded-button font-sans font-normal transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  variantClasses.value,
  sizeClasses.value,
  disabledClasses.value,
])

function handleClick(event: MouseEvent) {
  if (isDisabled.value) {
    event.preventDefault()
    event.stopPropagation()
    return
  }
  emit('click', event)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    if (isDisabled.value) {
      event.preventDefault()
      return
    }
    if (props.as !== 'button') {
      event.preventDefault()
      emit('click', event as unknown as MouseEvent)
    }
  }
}
</script>

<template>
  <component
    :is="props.as"
    :type="props.as === 'button' ? props.type : undefined"
    :class="buttonClasses"
    :aria-label="props.ariaLabel"
    :aria-disabled="isDisabled || undefined"
    :aria-busy="props.loading || undefined"
    :disabled="props.as === 'button' ? isDisabled : undefined"
    :role="props.as !== 'button' ? 'button' : undefined"
    :tabindex="props.as !== 'button' ? (isDisabled ? -1 : 0) : undefined"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <!-- Loading spinner overlay -->
    <span
      v-if="props.loading"
      class="absolute inset-0 flex items-center justify-center"
    >
      <svg
        class="animate-spin"
        :class="{
          'h-3 w-3': props.size === 'sm',
          'h-4 w-4': props.size === 'md',
          'h-5 w-5': props.size === 'lg',
        }"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </span>

    <!-- Content wrapper - invisible when loading but preserving space -->
    <span
      class="inline-flex items-center justify-center gap-2"
      :class="{ invisible: props.loading }"
    >
      <span v-if="$slots['icon-left']" class="inline-flex shrink-0">
        <slot name="icon-left" />
      </span>

      <span v-if="$slots.default">
        <slot />
      </span>

      <span v-if="$slots['icon-right']" class="inline-flex shrink-0">
        <slot name="icon-right" />
      </span>
    </span>
  </component>
</template>
