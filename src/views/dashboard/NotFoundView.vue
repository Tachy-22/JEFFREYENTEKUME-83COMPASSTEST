<template>
  <div class="flex flex-col items-center justify-center min-h-[400px] text-center">
    <h1 class="text-6xl font-bold text-gray-300 mb-4">404</h1>
    <h2 class="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
    <p class="text-gray-500 mb-8 max-w-md">
      The page you're looking for doesn't exist or hasn't been implemented yet.
    </p>
    <router-link 
      to="/dashboard/events" 
      class="px-6 py-3 bg-figma-orange text-white rounded-lg hover:bg-figma-orange/90 transition-colors"
    >
      Go to Events
    </router-link>
  </div>
</template>

<script setup lang="ts">
// Empty script section
</script>