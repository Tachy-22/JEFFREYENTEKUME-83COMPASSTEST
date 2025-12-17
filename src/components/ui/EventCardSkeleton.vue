<template>
  <div class="w-full pb-4 h-fit bg-dashboard-card-content items-center rounded flex p-4 gap-4">
    <!-- Date Badge Skeleton -->
    <div class="flex flex-col shrink-0 px-6">
      <!-- Day Number -->
      <div class="w-10 h-7.25 bg-white rounded-t-sm flex items-center justify-center">
        <SkeletonLoader width="w-6" height="h-4" className="bg-gray-300" />
      </div>
      <!-- Day Name -->
      <div class="w-10 h-7.25 bg-red-300 rounded-b-sm flex items-center justify-center">
        <SkeletonLoader width="w-8" height="h-4" className="bg-red-200" />
      </div>
    </div>

    <!-- Content Skeleton -->
    <div class="flex-1 flex flex-col justify-start">
      <!-- Time Skeleton -->
      <div class="mb-3">
        <SkeletonLoader width="w-32" height="h-3" />
      </div>

      <!-- Title Skeleton -->
      <div class="mb-3">
        <SkeletonLoader width="w-48" height="h-4" />
      </div>

      <!-- Description Skeleton -->
      <div class="mb-4 space-y-2">
        <SkeletonLoader width="w-full" height="h-3" />
        <SkeletonLoader width="w-3/4" height="h-3" />
      </div>

      <!-- Register Button Skeleton -->
      <SkeletonLoader width="w-20" height="h-6" className="rounded-sm" />
    </div>

    <!-- Event Image Skeleton -->
    <div class="shrink-0 w-[25%] h-full rounded overflow-hidden self-center">
      <SkeletonLoader width="w-full" height="h-24" className="rounded" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
</script>