<script setup lang="ts">
const props = defineProps<{ modelValue?: string, start?: boolean, disabled?: boolean }>()

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
  <input v-model="value" :class="[start ? 'place-self-start sm:max-w-300px w-full' : '', disabled ? 'opacity-50 cursor-not-allowed' : '']" class="bg-gris-900/30 rounded-lg border-gris-800 px-3 border h-10 focus:outline-none" :disabled="disabled" @input="updateValue">
</template>
