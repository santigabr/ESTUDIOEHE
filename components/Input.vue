<script setup lang="ts">
const props = defineProps<{ modelValue?: string }>()

const emit = defineEmits(['update:modelValue'])

const value = computed({
  get: () => props.modelValue,
  set: (newValue) => {
    emit('update:modelValue', newValue)
  },
})

function updateValue(event: Event) {
  const target = event.target as HTMLInputElement
  value.value = target.value
}
</script>

<template>
  <input v-model="value" class="bg-gris-900/30 rounded-lg border-gris-800 px-3 border h-10 focus:outline-none" @input="updateValue">
</template>
