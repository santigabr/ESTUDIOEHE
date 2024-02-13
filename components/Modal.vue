<script setup lang="ts">
const props = defineProps<{ wAuto?: boolean }>()
</script>

<template>
  <div class="absolute fixed z-40 w-full top-0 h-full grid overflow-auto items-center backdrop-blur-sm p-6">
    <div class="bg-gris-1000 shadow-lg border border-gris-800 rounded-lg p-5 grid gap-7 mx-auto w-full" :class="[props.wAuto ? 'max-w-auto' : 'max-w-600px']">
      <slot />
    </div>
  </div>
</template>
