<script setup lang="ts">
const route = useRoute()
const { data: servicio } = await useFetch(`/api/servicios/${route.params.id}`)
</script>

<template>
  <div class="grid gap-10 max-w-1200px mx-auto px-6 py-5 md:py-15 lg:py-20">
    <NuxtLink to="/servicios" class="flex items-center gap-1">
      <UnoIcon class="i-ph-arrow-left-bold h-5 w-5" />
      Volver
    </NuxtLink>

    <div class="grid gap-10">
      <h1 class="text-4xl font-bold">
        {{ servicio?.title }}
      </h1>
      <NuxtImg :src="servicio?.image" class="rounded-lg" provider="cloudinary" width="400" height="300" />
      <div class="prose max-w-none w-full" v-html="servicio?.desc" />
    </div>
  </div>
</template>
