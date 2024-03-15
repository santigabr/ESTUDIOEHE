<script setup lang="ts">
const route = useRoute()
const { data: plano } = await useFetch(`/api/planos/${route.params.id}`)
const selectedIndex = ref(0)
const selectedImage = computed(() => plano.value?.images[selectedIndex.value])
const desc = ref(false)

function navigate(step: number) {
  if (plano.value?.images)
    selectedIndex.value = (selectedIndex.value + step + plano.value?.images.length) % plano.value?.images.length
}

function selectImage(index: number) {
  selectedIndex.value = index
}

const caracteristicas = {
  size: {
    label: 'Tamaño',
    data: plano.value?.size,
    icon: 'i-radix-icons-size',
  },
  bathrooms: {
    label: 'Baños',
    data: plano.value?.bathrooms,
    icon: 'i-mdi-lavatory',
  },
  rooms: {
    label: 'Habitaciones',
    data: plano.value?.rooms,
    icon: 'i-material-symbols-bed',
  },
  garages: {
    label: 'Garages',
    data: plano.value?.garages,
    icon: 'i-ph-garage-light',
  },
}
</script>

<template>
  <div class="grid gap-10 max-w-1200px mx-auto px-6 py-5 md:py-15 lg:py-20">
    <NuxtLink to="/planos" class="flex items-center gap-1 sm:sticky sm:top-144px font-medium">
      <UnoIcon class="i-ph-arrow-left-bold h-5 w-5" />
      Volver
    </NuxtLink>

    <div class="flex flex-col md:flex-row md:gap-20">
      <div class="sm:hidden grid gap-3 pb-6">
        <h1 class="text-4xl font-bold tracking-tight">
          {{ plano?.title }}
        </h1>
        <p class="text-lg sm:text-xl text-white/70">
          ${{ plano?.price }}
        </p>
      </div>
      <div class="-mx-4 max-w-600px">
        <div class="w-full px-4 sm:mb-8 md:mb-0 sm:sticky top-208px">
          <div class="sticky top-0 overflow-hidden ">
            <div class="relative mb-6 lg:mb-10 lg:h-96">
              <NuxtImg :src="selectedImage" class="object-cover w-full lg:h-full rounded-lg shadow border-gris-800/30 border" provider="cloudinary" />
              <div class="absolute transform -translate-y-1/2 w-full top-1/2 flex justify-between px-2">
                <button class="grid place-content-center h-40px w-40px rounded-full bg-verde-1/30 hover:bg-verde-1 transition-colors duration-200" @click="navigate(-1)">
                  <UnoIcon class="i-material-symbols-chevron-left text-black/70 h-7 w-7" />
                </button>
                <button class="grid place-content-center h-40px w-40px rounded-full bg-verde-1/30 hover:bg-verde-1 transition-colors duration-200" @click="navigate(1)">
                  <UnoIcon class="i-material-symbols-chevron-right text-black/70 h-7 w-7" />
                </button>
              </div>
            </div>
            <div class="grid hidden md:grid grid-cols-2 gap-2 lg:grid-cols-4">
              <div v-for="(img, index) in plano?.images" :key="img">
                <button class="h-full w-full" @click="selectImage(index)">
                  <NuxtImg :src="img" class="rounded-lg w-full h-full object-cover" provider="cloudinary" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="max-w-500px w-full">
        <div class="grid gap-3 sm:gap-5">
          <h1 class="text-4xl sm:block hidden font-bold">
            {{ plano?.title }}
          </h1>
          <div class="grid gap-2 py-5">
            <div v-for="caracteristica in caracteristicas" :key="caracteristica.label" class="flex justify-between">
              <div class="flex items-center gap-1 font-medium tracking-tight ">
                <UnoIcon :class="`${caracteristica.icon} w-5 h-5`" />
                <p class="text-white/50">
                  {{ caracteristica.label }}
                </p>
              </div>
              <p>{{ caracteristica.data }}</p>
            </div>
          </div>
          <p class="text-lg sm:block hidden sm:text-xl">
            ${{ plano?.price }}
          </p>
          <Button class="h-12 mt-5">
            Agregar al carrito
          </Button>
        </div>

        <div class="border-y border-gris-800 mt-10">
          <button class="text-xl w-full flex justify-between flex items-center py-4" @click="desc = !desc">
            Descripción
            <UnoIcon class="h-7 w-7" :class="[desc ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down ']" />
          </button>
          <div v-if="desc" class="prose" v-html="plano?.desc" />
        </div>
      </div>
    </div>
  </div>
</template>
