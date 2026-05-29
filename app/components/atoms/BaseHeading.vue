<script setup lang="ts">
interface BaseHeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<BaseHeadingProps>(), {
  level: 1,
  size: 'xl',
})

const tag = `h${props.level}` as const

const sizeClasses: Record<string, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
}
</script>

<template>
  <component
    :is="tag"
    class="font-semibold text-gray-900"
    :class="sizeClasses[props.size]"
    style="font-family: 'Poppins', sans-serif;"
  >
    <slot />
  </component>
</template>
