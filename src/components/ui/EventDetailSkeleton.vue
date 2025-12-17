<template>
  <div class="py-4 px-4 pr-6 space-y-4">
    <!-- Page Title Skeleton -->
    <div>
      <!-- <SkeletonLoader width="w-20" height="h-6" /> -->
       Events
    </div>

    <!-- Action Buttons Row Skeleton -->
    <div class="flex items-center justify-between">
      <!-- Back Button Skeleton -->
      <div class="flex items-center gap-1">
        <SkeletonLoader width="w-3" height="h-3" className="rounded-full" />
        <SkeletonLoader width="w-8" height="h-3" />
      </div>

      <!-- Add Employee Button Skeleton -->
      <SkeletonLoader width="w-32" height="h-8" className="rounded-sm" />
    </div>

    <!-- Main Content Grid Skeleton -->
    <div class="grid grid-cols-1 lg:grid-cols-11 gap-4">
      <!-- Event Image Column Skeleton -->
      <div class="lg:col-span-5 flex flex-col">
        <div class="w-full h-fit bg-dashboard-card-content rounded-[1.5px] flex flex-col">
          <!-- Event Hero Image Skeleton -->
          <div class="relative w-full h-[188.25px] bg-gray-800 rounded-t-[1.5px] overflow-hidden">
            <SkeletonLoader width="w-full" height="h-full" />
            <!-- Event Title Overlay Skeleton -->
            <div class="absolute bottom-0 left-0 right-0 h-[27.75px] bg-black/20 flex items-center px-2.25">
              <SkeletonLoader width="w-32" height="h-4" />
            </div>
          </div>

          <!-- Event Description Skeleton -->
          <div class="flex-1 p-4.5 flex items-start">
            <div class="space-y-2 w-full">
              <SkeletonLoader width="w-full" height="h-3" />
              <SkeletonLoader width="w-full" height="h-3" />
              <SkeletonLoader width="w-full" height="h-3" />
              <SkeletonLoader width="w-3/4" height="h-3" />
              <SkeletonLoader width="w-full" height="h-3" />
              <SkeletonLoader width="w-5/6" height="h-3" />
            </div>
          </div>
        </div>
      </div>

      <!-- Event Details Panel Skeleton -->
      <div class="lg:col-span-3">
        <div class="bg-dashboard-card-content rounded h-fit py-4 flex flex-col">
          <!-- DETAILS Header Skeleton -->
          <div class="pl-2.25">
            <SkeletonLoader width="w-16" height="h-4" />
          </div>
          
          <!-- Details Content Skeleton -->
          <div class="flex-1 py-4 pl-3.5 flex flex-col justify-start space-y-6">
            <!-- Date Row Skeleton -->
            <div class="flex items-start">
              <SkeletonLoader width="w-12" height="h-3" className="mr-4" />
              <SkeletonLoader width="w-24" height="h-3" />
            </div>
            
            <!-- Time Row Skeleton -->
            <div class="flex items-start">
              <SkeletonLoader width="w-12" height="h-3" className="mr-4" />
              <SkeletonLoader width="w-32" height="h-3" />
            </div>
            
            <!-- Organizer Row Skeleton -->
            <div class="flex items-start">
              <SkeletonLoader width="w-16" height="h-3" className="mr-4" />
              <SkeletonLoader width="w-40" height="h-3" />
            </div>
            
            <!-- Type Row Skeleton -->
            <div class="flex items-start">
              <SkeletonLoader width="w-12" height="h-3" className="mr-4" />
              <SkeletonLoader width="w-28" height="h-3" />
            </div>
            
            <!-- Location Row Skeleton -->
            <div class="flex items-start">
              <SkeletonLoader width="w-16" height="h-3" className="mr-4" />
              <SkeletonLoader width="w-24" height="h-3" />
            </div>
            
            <!-- Department Row Skeleton -->
            <div class="flex items-start">
              <SkeletonLoader width="w-20" height="h-3" className="mr-4" />
              <SkeletonLoader width="w-28" height="h-3" />
            </div>
          </div>
        </div>
      </div>

      <!-- Registered Users Panel Skeleton -->
      <div class="lg:col-span-3">
        <div class="bg-dashboard-card-content rounded h-110.75 flex flex-col">
          <!-- REGISTERED USERS Header Skeleton -->
          <div class="pt-2.75 pl-4">
            <SkeletonLoader width="w-32" height="h-4" />
          </div>
          
          <!-- Users List Container Skeleton -->
          <div class="flex-1 pt-6.5 pl-1.25 pr-1.25">
            <div class="flex flex-col items-start p-2 gap-5.25 max-h-98 overflow-y-auto">
              <!-- User entries skeleton -->
              <div v-for="i in 8" :key="i" class="w-full min-h-4.75 shrink-0">
                <SkeletonLoader width="w-full" height="h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
</script>