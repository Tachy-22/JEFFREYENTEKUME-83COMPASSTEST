<template>
  <div class=" w-full  h-61.75 overflow-auto bg-dashboard-card-content rounded-md p-3.75">
    <!-- Header -->
    <h3 class="text-figma-orange font-lato font-extrabold text-[14px] mb-3">
      UPCOMING CELEBRATIONS
    </h3>

    <!-- Celebrations List -->
    <div class="space-y-2.25">
      <div
        v-for="celebration in celebrations"
        :key="celebration.id"
        class="flex items-center justify-between bg-dashboard-celebration rounded p-2.25"
      >
        <!-- Person Info -->
        <div class="flex items-center gap-2.25">
          <!-- Avatar -->
          <img
            :src="celebration.avatar"
            :alt="celebration.name"
            class="w-11.25 h-11.25 rounded-lg object-cover"
          />
          
          <!-- Details -->
          <div class="flex flex-col gap-1">
            <h4 class="text-white font-open-sans font-semibold text-[12px]">
              {{ celebration.name }}
            </h4>
            <p class="text-white font-open-sans font-semibold text-[10px]">
              {{ celebration.department }} ({{ celebration.occasion }})
            </p>
            <span class="text-figma-orange font-open-sans font-semibold text-xs">
              {{ celebration.date }}
            </span>
          </div>
        </div>

        <!-- Icon -->
        <div class="w-4.5 h-4.5 text-dashboard-text-primary">
          <component :is="celebration.icon" class="w-4.5 h-4.5" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Cake, PartyPopper, type LucideIcon } from 'lucide-vue-next'

interface Celebration {
  id: number
  name: string
  department: string
  occasion: string
  date: string
  avatar: string
  icon: LucideIcon
}

const celebrations = ref<Celebration[]>([
  {
    id: 1,
    name: 'Pru Ozaine',
    department: 'Finance Dept',
    occasion: 'Birthday',
    date: '20 Sep',
    avatar: '/images/person1.png',
    icon: Cake
  },
  {
    id: 2,
    name: 'Tina Salamone',
    department: 'Finance Dept',
    occasion: '10 years anniversary',
    date: '21 Sep',
    avatar: '/images/person3.png',
    icon: PartyPopper
  },
  {
    id: 3,
    name: 'Christiane Lundman',
    department: 'Tech Dept',
    occasion: 'Promotion',
    date: '29 Sep',
    avatar: '/images/person2.png',
    icon: PartyPopper
  }
])
</script>