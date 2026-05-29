<script setup lang="ts">
import { ref, computed, useId } from 'vue'

interface BaseInputProps {
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  type?: 'text' | 'password' | 'email' | 'number'
  error?: boolean
  errorMessage?: string
  ariaLabel?: string
}

const props = withDefaults(defineProps<BaseInputProps>(), {
  placeholder: undefined,
  disabled: false,
  readonly: false,
  type: 'text',
  error: false,
  errorMessage: undefined,
  ariaLabel: undefined,
})

const emit = defineEmits<{
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const model = defineModel<string | number>()

const isFocused = ref(false)
const errorId = useId()

const wrapperClasses = computed(() => [
  'base-input-wrapper',
  'flex items-center gap-2',
  'w-full h-12 rounded-lg border px-4',
  'font-sans text-sm',
  'transition-colors duration-150',
  borderClasses.value,
  stateClasses.value,
])

const borderClasses = computed(() => {
  if (props.error) return 'border-[#ef4444]'
  if (isFocused.value) return 'border-[#0075ff]'
  return 'border-[#d1d1d1]'
})

const stateClasses = computed(() => {
  if (props.disabled) return 'opacity-50 cursor-not-allowed pointer-events-none'
  return ''
})

function handleFocus(event: FocusEvent) {
  isFocused.value = true
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  isFocused.value = false
  emit('blur', event)
}
</script>

<template>
  <div>
    <div :class="wrapperClasses">
      <span v-if="$slots.left" class="inline-flex shrink-0">
        <slot name="left" />
      </span>

      <input
        v-model="model"
        :type="props.type"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :readonly="props.readonly"
        :aria-label="props.ariaLabel"
        :aria-invalid="props.error || undefined"
        :aria-describedby="props.error && props.errorMessage ? errorId : undefined"
        class="w-full h-full bg-transparent outline-none font-sans text-sm placeholder-[#888]"
        @focus="handleFocus"
        @blur="handleBlur"
      >

      <span v-if="$slots.right" class="inline-flex shrink-0">
        <slot name="right" />
      </span>
    </div>

    <p
      v-if="props.error && props.errorMessage"
      :id="errorId"
      class="mt-1 text-xs text-[#ef4444]"
    >
      {{ props.errorMessage }}
    </p>
  </div>
</template>
