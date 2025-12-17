<template>
  <div class="relative" ref="dropdownRef">
    <!-- Trigger -->
    <button
      @click="toggleDropdown"
      :class="[
        'flex items-center justify-between bg-dashboard-card rounded px-[9px] py-[9px] gap-[6px] transition-colors duration-200',
        'hover:bg-dashboard-card/80 focus:outline-none focus:ring-2 focus:ring-figma-orange focus:ring-offset-2 focus:ring-offset-transparent',
        triggerClass
      ]"
      :style="{ width: width }"
    >
      <span class="text-dashboard-text-secondary font-open-sans text-[12px]">
        {{ selectedOption?.label || placeholder }}
      </span>
      <ChevronDown 
        :class="[
          'w-[15px] h-[15px] text-dashboard-text-secondary transition-transform duration-200',
          { 'rotate-180': isOpen }
        ]" 
      />
    </button>

    <!-- Dropdown Content -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        :class="[
          'absolute z-50 mt-1 bg-dashboard-card border border-dashboard-sidebar-border rounded-md shadow-lg',
          'max-h-60 overflow-auto py-1',
          contentClass
        ]"
        :style="{ width: dropdownWidth }"
      >
        <div
          v-for="option in options"
          :key="option.value"
          @click="selectOption(option)"
          :class="[
            'flex items-center px-[9px] py-[6px] text-[10px] cursor-pointer transition-colors duration-150',
            'hover:bg-dashboard-sidebar/20 focus:bg-dashboard-sidebar/20',
            selectedOption?.value === option.value 
              ? 'bg-figma-orange/20 text-figma-orange' 
              : 'text-dashboard-text-secondary hover:text-white'
          ]"
          role="option"
          :aria-selected="selectedOption?.value === option.value"
        >
          <span class="font-open-sans">{{ option.label }}</span>
          <Check 
            v-if="selectedOption?.value === option.value"
            class="w-[12px] h-[12px] ml-auto text-figma-orange" 
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'

interface DropdownOption {
  label: string
  value: string | number
}

interface Props {
  options: DropdownOption[]
  modelValue?: string | number
  placeholder?: string
  width?: string
  triggerClass?: string
  contentClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select option',
  width: 'auto',
  triggerClass: '',
  contentClass: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [option: DropdownOption]
}>()

const dropdownRef = ref<HTMLElement>()
const isOpen = ref(false)

const selectedOption = computed(() => {
  return props.options.find(option => option.value === props.modelValue)
})

const dropdownWidth = computed(() => {
  return props.width === 'auto' ? 'auto' : props.width
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectOption = (option: DropdownOption) => {
  emit('update:modelValue', option.value)
  emit('change', option)
  isOpen.value = false
}

const closeDropdown = () => {
  isOpen.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

// Close dropdown on escape key
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeyDown)
})

// Expose methods for external access
defineExpose({
  close: closeDropdown,
  toggle: toggleDropdown
})
</script>