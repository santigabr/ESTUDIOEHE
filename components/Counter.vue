<script setup lang="ts">
const props = defineProps<{ value: number, label: string }>()
const emit = defineEmits(['update:value'])
const value = ref(props.value)
function increment() {
  value.value++
  emit('update:value', value.value)
}

function decrement() {
  if (value.value > 0) {
    value.value--
    emit('update:value', value.value)
  }
}
</script>

<template>
  <div class="grid gap-1">
    <label class="text-sm font-medium">{{ props.label }}</label>
    <div class="flex gap-1 items-center">
      <button @click="decrement">
        -
      </button>
      <span>{{ value }}</span>
      <button @click="increment">
        +
      </button>
    </div>
  </div>
</template>
