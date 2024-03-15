<script setup lang="ts">
const route = useRoute()
const { data: asesoramiento } = await useFetch(`/api/asesoramientos/${route.params.id}`)
</script>

<template>
  <div class="grid gap-10 max-w-1200px mx-auto px-6 py-5 md:py-15 lg:py-20">
    <NuxtLink to="/asesoramiento" class="flex items-center gap-1 font-medium">
      <UnoIcon class="i-ph-arrow-left-bold h-5 w-5" />
      Volver
    </NuxtLink>

    <div>
      <div class="grid gap-7">
        <h1 class="text-4xl font-bold">
          {{ asesoramiento?.title }}
        </h1>
        <p>{{ asesoramiento?.desc }}</p>
      </div>
      <div class="prose max-w-none w-full" v-html="asesoramiento?.content" />
    </div>
  </div>
</template>

<style>
.prose img{
  border-radius: 0.5rem;
}
</style>
