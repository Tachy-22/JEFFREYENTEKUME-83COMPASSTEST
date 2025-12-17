<template>
  <div class="w-full">
    <div 
      :class="containerClasses"
      :style="containerStyle"
    >
      <input
        ref="inputRef"
        v-bind="$attrs"
        :value="modelValue"
        @input="handleInput"
        @blur="handleBlur"
        :class="inputClasses"
        class="flex-1 bg-transparent border-none outline-none text-white placeholder-white font-roboto"
      />
      <div v-if="icon" class="shrink-0 ml-auto">
        <component :is="icon" class="w-4 h-4 text-white" stroke-width="1.5" />
      </div>
    </div>
    
    <!-- Error Message -->
    <div v-if="error && showError" class="mt-1 text-red-400 text-xs font-roboto min-h-4">
      {{ error }}
    </div>
    <div v-else class="mt-1 min-h-4"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Component } from 'vue'

interface Props {
  modelValue?: string
  hasBorder?: boolean
  icon?: Component
  class?: string
  error?: string | null
  showError?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  hasBorder: false,
  class: '',
  error: null,
  showError: true
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
}>()

const inputRef = ref<HTMLInputElement>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleBlur = () => {
  emit('blur')
}

const containerClasses = computed(() => [
  'flex',
  'items-center',
  'w-full',
  'max-w-[330px]',
  'h-8',
  'bg-white/[0.17]',
  'rounded-sm',
  'px-2',
  'py-1',
  'border',
  'transition-colors',
  'duration-200',
  'focus-within:border-figma-orange',
  {
    'border-figma-orange-border': props.hasBorder,
    'border-transparent': !props.hasBorder && !props.error,
    'border-red-400': !!props.error,
  },
  props.class
])

const containerStyle = computed(() => ({
  fontSize: '13.0227px',
  lineHeight: '15px',
}))

const inputClasses = computed(() => [
  'text-sm',
  'placeholder:text-white/80'
])

// Focus methods for external access
const focus = () => {
  inputRef.value?.focus()
}

const blur = () => {
  inputRef.value?.blur()
}

defineExpose({
  focus,
  blur
})
</script>