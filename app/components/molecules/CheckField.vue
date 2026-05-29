<script setup lang="ts">
import BaseIcon from '../atoms/BaseIcon.vue'
import BaseCheckbox from '../atoms/BaseCheckbox.vue'

// =====================
// Types
// =====================

interface CheckFieldProps {
  icon: string
  title: string
  subtitle?: string
  disabled?: boolean
}

// =====================
// Props & Model
// =====================

const props = withDefaults(defineProps<CheckFieldProps>(), {
  subtitle: undefined,
  disabled: false,
})

const model = defineModel<boolean>({ default: false })

// =====================
// Handlers
// =====================

function handleClick() {
  if (props.disabled) return
  model.value = !model.value
}
</script>

<template>
  <div
    role="group"
    :aria-disabled="props.disabled || undefined"
    :tabindex="props.disabled ? -1 : 0"
    :class="[
      'flex items-center gap-4 rounded-lg border p-4 transition-colors',
      model
        ? 'border-solid border-[#4a7f34]'
        : 'border-dashed border-[#d1d1d1]',
      props.disabled
        ? 'opacity-50 cursor-not-allowed'
        : 'cursor-pointer',
    ]"
    @click="handleClick"
    @keydown.space.prevent="handleClick"
    @keydown.enter.prevent="handleClick"
  >
    <!-- Icon + Texts -->
    <div class="flex flex-1 items-center gap-3">
      <BaseIcon
        :name="props.icon"
        :size="24"
        aria-hidden
      />

      <div class="flex flex-col">
        <span class="text-sm font-medium text-[#3d3d3d] select-none">
          {{ props.title }}
        </span>
        <span
          v-if="props.subtitle"
          class="text-xs text-[#6d6d6d] select-none"
        >
          {{ props.subtitle }}
        </span>
      </div>
    </div>

    <!-- Checkbox -->
    <BaseCheckbox
      :model-value="model"
      :disabled="props.disabled"
      @update:model-value="model = $event"
      @click.stop
    />
  </div>
</template>
