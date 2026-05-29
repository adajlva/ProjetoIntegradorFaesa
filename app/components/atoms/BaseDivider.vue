<script setup lang="ts">
interface BaseDividerProps {
  orientation?: 'horizontal' | 'vertical'
  color?: string
  spacing?: string
  thickness?: string
}

const props = withDefaults(defineProps<BaseDividerProps>(), {
  orientation: 'horizontal',
  color: '#d1d1d1',
  spacing: '0',
  thickness: '1px',
})
</script>

<template>
  <hr
    v-if="props.orientation === 'horizontal'"
    class="w-full border-none m-0"
    :style="{
      borderTop: `${props.thickness} solid ${props.color}`,
      margin: `${props.spacing} 0`,
    }"
  >
  <div
    v-else
    role="separator"
    aria-orientation="vertical"
    class="h-full"
    :style="{
      borderLeft: `${props.thickness} solid ${props.color}`,
      margin: `0 ${props.spacing}`,
    }"
  />
</template>
