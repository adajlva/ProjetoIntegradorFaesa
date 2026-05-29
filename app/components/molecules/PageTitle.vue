<script setup lang="ts">
import BaseHeading from '../atoms/BaseHeading.vue'
import BaseIconButton from '../atoms/BaseIconButton.vue'

interface PageTitleProps {
  title: string
  backRoute?: string
  showBack?: boolean
}

const props = withDefaults(defineProps<PageTitleProps>(), {
  backRoute: undefined,
  showBack: true,
})

const emit = defineEmits<{
  back: []
}>()

function handleBack() {
  if (props.backRoute) {
    const router = useRouter()
    router.push(props.backRoute)
  }
  emit('back')
}
</script>

<template>
  <div class="flex items-center gap-3">
    <BaseIconButton
      v-if="props.showBack"
      icon="ArrowLeft"
      variant="outline"
      size="md"
      aria-label="Voltar"
      @click="handleBack"
    />
    <BaseHeading :level="1" size="xl">
      {{ props.title }}
    </BaseHeading>
  </div>
</template>
