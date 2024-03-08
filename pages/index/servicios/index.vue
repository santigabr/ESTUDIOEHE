<script setup lang="ts">
const { data: servicios, pending } = await useFetch('/api/servicios')
</script>

<template>
  <div class="mx-auto max-w-1200px">
    <section v-if="!pending" className="w-full py-5 md:py-15 lg:py-20">
      <div className="px-6 space-y-10 md:space-y-12">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-start text-center font-bold tracking-tighter">
            Nuestros Servicios
          </h1>
          <p className="text-white/70 sm:text-start text-center text-xl/relaxed">
            Soluciones para todas sus necesidades de desarrollo.
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <div v-for="servicio in servicios" :key="servicio.id" class="bg-gris-900/30 rounded-lg">
            <NuxtImg class="rounded-t-lg object-cover w-full" :src="servicio.image" provider="cloudinary" />
            <div class="p-5">
              <NuxtLink>
                <h5 class="mb-2 text-lg font-medium tracking-tight text-white">
                  {{ servicio.title }}
                </h5>
              </NuxtLink>
              <p class="mb-3 font-400 text-white/70">
                {{ servicio.desc.length > 100 ? `${servicio.desc.substring(0, 100)}...` : servicio.desc }}
              </p>
              <NuxtLink :to="`/servicios/${servicio.id}`" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg focus:ring-4 focus:outline-none bg-blue-600 hover:bg-blue-700 focus:ring-blue-800">
                Leer mas
                <UnoIcon class="i-ph-arrow-right-bold w-4 h-4 ms-2" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
