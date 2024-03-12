<script setup lang="ts">
const { data: servicios, pending } = await useFetch('/api/servicios')
</script>

<template>
  <div class="mx-auto max-w-1200px">
    <section v-if="!pending" class="w-full py-5 md:py-15 lg:py-20">
      <div class="px-6 space-y-10 md:space-y-12">
        <div class="space-y-2">
          <h1 class="text-3xl sm:text-4xl sm:text-start text-center font-bold tracking-tighter">
            Nuestros Servicios
          </h1>
          <p class="text-white/70 sm:text-start text-center text-xl/relaxed">
            Soluciones para todas sus necesidades de desarrollo.
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <div v-for="servicio in servicios" :key="servicio.id" class="bg-gris-900/30 rounded-lg grid">
            <div class="grid sm:grid-rows-[1fr_auto]">
              <div class="flex flex-col items-start">
                <NuxtImg class="rounded-t-lg object-cover w-full" :src="servicio.image" provider="cloudinary" />
                <div class="pt-5 px-5">
                  <NuxtLink :to="`/servicios/${servicio.id}`">
                    <h5 class="mb-2 text-lg font-medium tracking-tight text-white">
                      {{ servicio.title }}
                    </h5>
                  </NuxtLink>

                  <p class="mb-3 font-400 text-white/70">
                    {{
                      servicio.desc.length > 100 ? `${
                        servicio.desc
                          .replace(/<h2>.*?<\/h2>/g, '')
                          .replace(/<h3>.*?<\/h3>/g, '')
                          .replace(/<li>.*?<\/li>/g, '')
                          .replace(/<ul>.*?<\/ul>/g, '')
                          .replace(/(:)/g, ': ')
                          .replace(/<\/?p>/g, '')
                          .substring(0, 100)}...`
                      : servicio.desc.replace(/<h2>.*?<\/h2>/g, '')
                        .replace(/<h3>.*?<\/h3>/g, '')
                        .replace(/<li>.*?<\/li>/g, '')
                        .replace(/<ul>.*?<\/ul>/g, '')
                        .replace(/(:)/g, ': ')
                        .replace(/<\/?p>/g, '')
                    }}
                  </p>
                </div>
              </div>
              <NuxtLink :to="`/servicios/${servicio.id}`" class="inline-flex mx-5 mb-5 place-self-start items-center px-3 py-2 text-sm font-medium text-center rounded-lg bg-verde-1 hover:bg-verde-1">
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
