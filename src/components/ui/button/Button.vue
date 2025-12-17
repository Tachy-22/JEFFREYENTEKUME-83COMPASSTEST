<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="buttonClasses"
    @click="handleClick"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  class: ''
})

const emit = defineEmits<{
  click: [event: Event]
}>()

const handleClick = (event: Event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

const buttonClasses = computed(() => [
  // Base styles
  'inline-flex',
  'items-center',
  'justify-center',
  'font-medium',
  'font-roboto',
  'rounded-sm',
  'transition-colors',
  'duration-200',
  'focus:outline-none',
  'focus:ring-2',
  'focus:ring-figma-orange',
  'focus:ring-offset-2',
  'focus:ring-offset-transparent',
  
  // Size variants
  {
    'h-8 px-3 text-sm': props.size === 'sm',
    'h-8 px-4 text-sm': props.size === 'md', 
    'h-12 px-6 text-base': props.size === 'lg',
  },
  
  // Variant styles
  {
    // Primary variant (default auth button style)
    'bg-figma-orange hover:bg-figma-orange/90 disabled:bg-figma-orange/70 text-white': 
      props.variant === 'primary',
      
    // Secondary variant
    'bg-white/10 hover:bg-white/20 disabled:bg-white/5 text-white border border-white/20 hover:border-white/30': 
      props.variant === 'secondary',
      
    // Outline variant
    'bg-transparent hover:bg-figma-orange/10 disabled:bg-transparent text-figma-orange border border-figma-orange hover:border-figma-orange/80 disabled:border-figma-orange/50 disabled:text-figma-orange/50': 
      props.variant === 'outline',
  },
  
  // Loading and disabled states
  {
    'cursor-not-allowed opacity-50': props.disabled || props.loading,
    'cursor-pointer': !props.disabled && !props.loading,
  },
  
  // Width responsiveness - only apply default width if no width classes in custom class
  !props.class.includes('w-') ? 'w-full max-w-[330px]' : '',
  
  // Custom classes
  props.class
])
</script>