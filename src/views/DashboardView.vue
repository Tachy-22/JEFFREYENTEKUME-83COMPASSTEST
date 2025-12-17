<template>
  <div class="min-h-screen w-full bg-dashboard-dark">
    <!-- Header -->
    <DashboardHeader />
    
    <!-- Main Content Area -->
    <div class="flex w-full">
      <!-- Sidebar Navigation -->
      <DashboardSidebar />
      
      <!-- Main Content -->
      <main class="w-full min-h-screen pt-20 sm:pt-18.75 ml-0 lg:ml-47">
        <div class="w-full h-full px-3 sm:px-2 md:px-6 lg:px-0 py-3 sm:py-4 lg:py-6">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar.vue'
</script>