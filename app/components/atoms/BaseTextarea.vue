<script setup lang="ts">
import { ref, computed, useId } from 'vue'

interface BaseTextareaProps {
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  rows?: number
  maxLength?: number
  error?: boolean
  errorMessage?: string
  ariaLabel?: string
}

const props = withDefaults(defineProps<BaseTextareaProps>(), {
  placeholder: undefined,
  disabled: false,
  readonly: false,
  rows: 4,
  maxLength: undefined,
  error: false,
  errorMessage: undefined,
  ariaLabel: undefined,
})

const emit = defineEmits<{
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const model = defineModel<string>()

const isFocused = ref(false)
const errorId = useId()

const wrapperClasses = computed(() => [
  'base-textarea-wrapper',
  'w-full rounded-lg border p-4',
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

const charCount = computed(() => {
  return model.value?.length ?? 0
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
      <textarea
        v-model="model"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :readonly="props.readonly"
        :rows="props.rows"
        :maxlength="props.maxLength"
        :aria-label="props.ariaLabel"
        :aria-invalid="props.error || undefined"
        :aria-describedby="props.error && props.errorMessage ? errorId : undefined"
        class="w-full resize-y bg-transparent outline-none font-sans text-sm placeholder-[#888]"
        @focus="handleFocus"
        @blur="handleBlur"
      />
    </div>

    <div class="flex items-center justify-between mt-1">
      <p
        v-if="props.error && props.errorMessage"
        :id="errorId"
        class="text-xs text-[#ef4444]"
      >
        {{ props.errorMessage }}
      </p>
      <span v-else />

      <span
        v-if="props.maxLength"
        class="text-xs text-[#888]"
      >
        {{ charCount }}/{{ props.maxLength }}
      </span>
    </div>
  </div>
</template>
