<script setup lang="ts">
const { data: planos, pending } = await useFetch('/api/planos')
const caracteristicas = ['Tamaño', 'Baños', 'Habitaciones', 'Garages']
</script>

<template>
  <div class="mx-auto max-w-1200px">
    <section v-if="!pending" class="w-full py-5 md:py-15 lg:py-20">
      <div class="px-6 space-y-10 md:space-y-12">
        <div class="space-y-2">
          <h1 class="text-3xl sm:text-4xl font-bold text-center sm:text-start tracking-tighter">
            Planos
          </h1>
          <p class="text-xl text-white/70 text-center sm:text-start">
            Soluciones para todas sus necesidades de desarrollo.
          </p>
        </div>
        <div class="md:flex grid w-full md:gap-20 gap-6 items-center md:justify-between">
          <input
            placeholder="Buscar..."
            class="w-full bg-gris-900/20 rounded-lg outline-none px-3 py-2"
          >
          <div class="flex gap-2 items-center md:justify-end md:overflow-unset overflow-auto">
            <button
              v-for="caracteristica in caracteristicas"
              :key="caracteristica"
              class="flex items-center gap-1 bg-gris-900/20 px-3 py-2 rounded-full text-sm"
            >
              {{ caracteristica }}
              <UnoIcon class="i-lucide-chevron-down h-5 w-5" />
            </button>
          </div>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          <div v-for="plano in planos" :key="plano.id" class="bg-gris-900/30 rounded-lg">
            <NuxtLink :to="`/planos/${plano.id}`">
              <NuxtImg
                class="rounded-t-lg object-cover w-full"
                :src="plano.images[0]"
                provider="cloudinary"
              />
            </NuxtLink>
            <div class="p-5">
              <NuxtLink :to="`/planos/${plano.id}`">
                <h5 class="mb-2 font-bold text-white tracking-tight">
                  {{ plano.title }}
                </h5>
              </NuxtLink>
              <p class="text-sm text-white/70">
                ${{ plano.price }},00
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
