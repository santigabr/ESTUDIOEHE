<script setup lang="ts">
const { data: planos, pending } = await useFetch('/api/planos')
</script>

<template>
  <div class="mx-auto max-w-1200px">
    <section v-if="!pending" class="w-full py-5 md:py-15 lg:py-20">
      <div class="px-6 space-y-10 md:space-y-12">
        <div class="space-y-2">
          <h1 class="text-3xl sm:text-start text-center font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Planos
          </h1>
          <p class="text-white/70 sm:text-start text-center md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Soluciones para todas sus necesidades de desarrollo.
          </p>
        </div>
        <div class="grid grid-cols-3 gap-5">
          <div v-for="plano in planos" :key="plano.id" class="bg-gris-900/30 rounded-lg">
            <NuxtImg class="rounded-t-lg object-cover w-full" :src="plano.images[0]" provider="cloudinary" />
            <div class="p-5">
              <NuxtLink :to="`/planos/${plano.id}`">
                <h5 class="mb-2 text-xl font-medium tracking-tight text-white">
                  {{ plano.title }}
                </h5>
              </NuxtLink>
              <p class="font-normal text-white/70">
                ${{ plano.price }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
