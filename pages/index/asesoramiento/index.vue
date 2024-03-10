<script setup lang="ts">
const { data: asesoramientos, pending } = await useFetch('/api/asesoramientos')
</script>

<template>
  <div class="mx-auto max-w-1200px">
    <section v-if="!pending" class="w-full py-5 md:py-15 lg:py-20">
      <div class="px-6 space-y-10 md:space-y-12">
        <div class="space-y-2">
          <h1 class="text-3xl sm:text-4xl sm:text-start text-center font-bold tracking-tighter">
            Asesoramiento
          </h1>
          <p class="text-white/70 sm:text-start text-center text-xl/relaxed">
            Soluciones para todas sus necesidades de desarrollo.
          </p>
        </div>
        <div class="grid w-full sm:grid-cols-2 gap-6 md:grid-cols-3 md:gap-8">
          <div v-for="asesoramiento in asesoramientos" :key="asesoramiento.id" class="flex flex-col gap-2 rounded-xl bg-gris-900/30 p-4">
            <div class="flex flex-col gap-3">
              <h3 class="text-xl font-semibold tracking-tight">
                {{ asesoramiento.title }}
              </h3>
              <p class="text-white/70 dark:text-gray-400">
                {{ asesoramiento.desc.length > 100 ? `${asesoramiento.desc.substring(0, 100)}...` : asesoramiento.desc }}
              </p>
              <NuxtLink :to="`/asesoramiento/${asesoramiento.id}`" class="inline-flex grid gap-1 place-self-start items-center text-blue-500 text-sm font-medium text-center">
                Leer mas
                <UnoIcon class="i-ph-arrow-right-bold w-4 h-4" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
