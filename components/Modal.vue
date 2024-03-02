<script setup lang="ts">
const props = defineProps<{ top0?: boolean, fat?: boolean }>()
</script>

<template>
  <div class="absolute fixed z-40 w-full top-0 h-full grid overflow-auto items-center backdrop-blur-sm p-6">
    <div class="bg-gris-1000 shadow-lg border border-gris-800 rounded-lg py-5 grid mx-auto w-full max-w-600px" :class="[props.top0 ? '' : 'gap-7', fat ? 'px-10' : 'px-5']">
      <slot />
    </div>
  </div>
</template>
