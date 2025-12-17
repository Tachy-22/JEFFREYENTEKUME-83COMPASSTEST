<template>
  <div 
    :class="[
      'animate-pulse bg-linear-to-r from-stone-700 via-stone-600 to-stone-700 bg-size-[200%_100%] rounded',
      width,
      height,
      className
    ]"
  ></div>
</template>

<script setup lang="ts">
interface Props {
  width?: string
  height?: string
  className?: string
}

withDefaults(defineProps<Props>(), {
  width: 'w-full',
  height: 'h-4',
  className: ''
})
</script>

<style scoped>
.animate-pulse {
  background: linear-gradient(90deg, #44403b 25%, #57534d 50%, #44403b 75%);
  background-size: 200% 100%;
  animation: pulse-shimmer 1.5s infinite;
}

@keyframes pulse-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>