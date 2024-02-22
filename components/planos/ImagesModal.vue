<script setup lang="ts">
const props = defineProps<{ show?: boolean, images: string[] }>()
const emit = defineEmits(['close'])
const selectedIndex = ref(0)

const selectedImage = computed(() => props.images[selectedIndex.value])

function close() {
  emit('close')
}

function navigate(step: number) {
  selectedIndex.value = (selectedIndex.value + step + props.images.length) % props.images.length
}

function selectImage(index: number) {
  selectedIndex.value = index
}
</script>

<template>
  <Modal v-if="props.show">
    <div class="flex justify-between">
      <h1 class="text-xl font-medium underline underline-verde-1">
        Imágenes
      </h1>
      <button @click="close()">
        <UnoIcon class="i-ph-x-bold h-5 w-5" />
      </button>
    </div>

    <div>
      <div class="-mx-4">
        <div class="w-full px-4 mb-8 md:mb-0">
          <div class="sticky top-0 overflow-hidden ">
            <div class="relative mb-6 lg:mb-10 lg:h-96">
              <button class="absolute left-0 transform -translate-y-1/2 top-1/2" @click="navigate(-1)">
                <UnoIcon class="i-material-symbols-chevron-left h-10 w-10" />
              </button>
              <NuxtImg :src="selectedImage" class="object-cover w-full lg:h-full rounded-lg shadow border-gris-800/30 border" provider="cloudinary" />

              <button class="absolute right-0 transform -translate-y-1/2 top-1/2" @click="navigate(1)">
                <UnoIcon class="i-material-symbols-chevron-right h-10 w-10" />
              </button>
            </div>
            <div class="grid grid-cols-2 gap-2 md:grid-cols-4">
              <div v-for="(img, index) in props.images" :key="img">
                <button class="h-full w-full" @click="selectImage(index)">
                  <NuxtImg :src="img" class="rounded-lg w-full h-full object-cover" provider="cloudinary" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>
