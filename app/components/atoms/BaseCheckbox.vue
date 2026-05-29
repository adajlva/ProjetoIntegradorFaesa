<script setup lang="ts">
import { ref, computed, watch, type Ref } from 'vue'

// =====================
// Types
// =====================

interface BaseCheckboxProps {
  label?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  indeterminate?: boolean
}

// =====================
// Props & Model
// =====================

const props = withDefaults(defineProps<BaseCheckboxProps>(), {
  label: undefined,
  size: 'md',
  disabled: false,
  indeterminate: false,
})

const model = defineModel<boolean>({ default: false })

// =====================
// Sizes
// =====================

const sizeConfig = computed(() => {
  const sizes: Record<string, { box: string; icon: string; label: string }> = {
    sm: { box: 'h-4 w-4', icon: 'h-2.5 w-2.5', label: 'text-xs' },
    md: { box: 'h-5 w-5', icon: 'h-3 w-3', label: 'text-sm' },
    lg: { box: 'h-6 w-6', icon: 'h-3.5 w-3.5', label: 'text-base' },
  }
  return sizes[props.size] || sizes.md
})

// =====================
// Template Refs
// =====================

const inputRef: Ref<HTMLInputElement | null> = ref(null)

// =====================
// Indeterminate sync
// =====================

watch(
  () => props.indeterminate,
  (val) => {
    if (inputRef.value) {
      inputRef.value.indeterminate = val
    }
  },
)

watch(inputRef, (el) => {
  if (el) {
    el.indeterminate = props.indeterminate
  }
})

// =====================
// Handlers
// =====================

function handleChange() {
  if (props.disabled) return
  model.value = !model.value
}
</script>

<template>
  <label
    :class="[
      'inline-flex items-center gap-2',
      props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    ]"
  >
    <!-- Hidden native input for accessibility -->
    <input
      ref="inputRef"
      type="checkbox"
      class="sr-only"
      :checked="model"
      :disabled="props.disabled"
      @change="handleChange"
    >

    <!-- Visual checkbox -->
    <div
      :class="[
        'flex shrink-0 items-center justify-center rounded border-2 transition-colors',
        sizeConfig.box,
        model || props.indeterminate
          ? 'bg-[#4a7f34] border-[#4a7f34]'
          : 'bg-white border-[#d1d1d1]',
      ]"
    >
      <!-- Check icon -->
      <svg
        v-if="model && !props.indeterminate"
        :class="[sizeConfig.icon, 'text-white']"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M2 6L5 9L10 3"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>

      <!-- Indeterminate icon -->
      <svg
        v-if="props.indeterminate"
        :class="[sizeConfig.icon, 'text-white']"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M2 6H10"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    </div>

    <!-- Label text -->
    <span v-if="props.label" :class="['select-none', sizeConfig.label]">
      {{ props.label }}
    </span>
  </label>
</template>
