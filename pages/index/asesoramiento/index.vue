<script setup lang="ts">
const { data: asesoramientos, pending } = await useFetch('/api/asesoramientos')
</script>

<template>
  <div class="mx-auto max-w-1200px">
    <section v-if="!pending" className="w-full py-5 md:py-15 lg:py-20">
      <div className="px-6 space-y-10 md:space-y-12">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-start text-center font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Asesoramiento
          </h1>
          <p className="text-white/70 sm:text-start text-center md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Soluciones para todas sus necesidades de desarrollo.
          </p>
        </div>
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          <div v-for="asesoramiento in asesoramientos" :key="asesoramiento.id" className="flex flex-col gap-2 rounded-xl bg-gris-900/30 p-4">
            <div className="flex flex-col gap-3">
              <div class="flex flex-col items-start gap-1">
                <h3 className="text-xl font-semibold tracking-tight">
                  {{ asesoramiento.title }}
                </h3>
                <p className="text-white/70 dark:text-gray-400">
                  {{ asesoramiento.desc.length > 100 ? `${asesoramiento.desc.substring(0, 100)}...` : asesoramiento.desc }}
                </p>
                <NuxtLink :to="`/asesoramiento/${asesoramiento.id}`" class="text-blue-600">
                  Leer mas .
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
