<script setup lang="ts">
const props = defineProps<{ link?: boolean, start?: boolean, rlg?: boolean, red?: boolean }>()
</script>

<template>
  <NuxtLink v-if="props.link" class="text-sm bg-gris-50 font-medium hover:bg-gris-200 transition-colors duration-200 text-black px-4 py-2" :class="[start ? 'place-self-start' : '', rlg ? 'rounded-lg' : 'rounded-full']">
    <slot />
  </NuxtLink>
  <button v-else class="text-sm font-medium transition-colors duration-200 px-4 py-2" :class="[start ? 'place-self-start' : '', rlg ? 'rounded-lg' : 'rounded-full', red ? 'bg-red-500' : 'bg-gris-50 text-black  hover:bg-gris-200']">
    <slot />
  </button>
</template>
