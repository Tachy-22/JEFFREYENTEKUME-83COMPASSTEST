<template>
  <aside class="max-w-47 w-47 h-screen bg-dashboard-sidebar border-r border-t border-dashboard-sidebar-border fixed left-0 top-20 sm:top-18.75 z-30 hidden lg:block">
    <nav class="p-1.5 mt-4">
      <div class="space-y-4">
        <!-- Navigation Items -->
        <div
          v-for="item in navigationItems"
          :key="item.name"
          :class="[
            'flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer',
            item.active 
              ? 'bg-dashboard-accent text-white' 
              : 'text-dashboard-text-secondary hover:text-white hover:bg-dashboard-text-secondary/10'
          ]"
          @click="handleNavigation(item)"
        >
          <component 
            :is="item.icon" 
            class="w-4 h-4"
            :class="item.active ? 'text-white' : 'text-dashboard-text-secondary'"
          />
          <span 
            class="text-xs font-lato"
            :class="item.active ? 'font-bold text-white' : 'font-normal'"
          >
            {{ item.label }}
          </span>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Home, 
  Users, 
  Newspaper, 
  Calendar, 
  Users2, 
  Package, 
  Star,
  BarChart3,
  type LucideIcon
} from 'lucide-vue-next'

const router = useRouter()

interface NavigationItem {
  name: string
  label: string
  icon: LucideIcon
  route: string
  active: boolean
}

const navigationItems = ref<NavigationItem[]>([
  {
    name: 'boardroom',
    label: 'Boardroom Meeting',
    icon: Home,
    route: '/dashboard/boardroom',
    active: false
  },
  {
    name: 'employees',
    label: 'Employee Directory',
    icon: Users,
    route: '/dashboard/employees',
    active: false
  },
  {
    name: 'news',
    label: 'News',
    icon: Newspaper,
    route: '/dashboard/news',
    active: false
  },
  {
    name: 'events',
    label: 'Events',
    icon: Calendar,
    route: '/dashboard/events',
    active: true
  },
  {
    name: 'boardroom2',
    label: 'Boardroom Meeting',
    icon: Users2,
    route: '/dashboard/boardroom-2',
    active: false
  },
  {
    name: 'resources',
    label: 'Resources',
    icon: Package,
    route: '/dashboard/resources',
    active: false
  },
  {
    name: 'suggestion',
    label: 'Suggestion Box',
    icon: Star,
    route: '/dashboard/suggestions',
    active: false
  },
  {
    name: 'spotlight',
    label: 'Spotlight',
    icon: Star,
    route: '/dashboard/spotlight',
    active: false
  },
  {
    name: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    route: '/dashboard/analytics',
    active: false
  }
])

const handleNavigation = (item: NavigationItem) => {
  // Update active state
  navigationItems.value.forEach(navItem => {
    navItem.active = navItem.name === item.name
  })
  
  // Navigate to route
  router.push(item.route)
}
</script>