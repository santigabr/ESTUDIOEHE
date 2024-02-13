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
  <Modal v-if="props.show" w-auto>
    <div class="flex justify-between">
      <h1 class="text-xl font-medium underline underline-verde-1">
        Imagines
      </h1>
      <button @click="close()">
        <UnoIcon class="i-ph-x-bold h-5 w-5" />
      </button>
    </div>

    <div class="max-w-6xl px-4 mx-auto">
      <div class="flex flex-wrap mb-24 -mx-4">
        <div class="w-full px-4 mb-8 md:w-1/2 md:mb-0">
          <div class="sticky top-0 overflow-hidden ">
            <div class="relative mb-6 lg:mb-10 lg:h-96">
              <button class="absolute left-0 transform lg:mr-2 top-1/2 translate-1/2" @click="navigate(-1)">
                <UnoIcon class="i-material-symbols-chevron-left h-10 w-10" />
              </button>
              <NuxtImg :src="selectedImage" class="object-contain w-full lg:h-full" provider="cloudinary" />

              <button class="absolute right-0 transform lg:mr-2 top-1/2 translate-1/2" @click="navigate(1)">
                <UnoIcon class="i-material-symbols-chevron-right h-10 w-10" />
              </button>
            </div>
            <div class="flex-wrap hidden -mx-2 md:flex">
              <div v-for="(img, index) in props.images" :key="img" class="w-1/2 p-2 sm:w-1/4">
                <button @click="selectImage(index)">
                  <NuxtImg :src="img" class="object-contain w-full lg:h-full" provider="cloudinary" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>
