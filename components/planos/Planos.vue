<script setup lang="ts">
const props = defineProps<{ data: { id: string, size: string }[] | null }>()

const { data: planos, refresh, pending } = await useFetch('/api/planos')

const state = reactive({
  addmenu: false,
  images: [] as string[],
  squares: Array(5).fill(null) as Array<string | null>,
  files: [] as string[],
  title: '',
  desc: '',
  size: '',
  bathrooms: 0,
  rooms: 0,
  suites: 0,
  garages: 0,
  price: '',
  deleting: false,
  adding: false,
  showimages: false,
  imagesId: [] as string[],
  showdesc: false,
  descData: '',
  errors: {
    title: '',
    desc: '',
    size: '',
    images: '',
    files: '',
    price: '',
  },
})

function resetState() {
  Object.assign(state, {
    title: '',
    desc: '',
    size: '',
    bathrooms: 0,
    rooms: 0,
    garages: 0,
    suites: 0,
    images: [],
    files: [],
    price: '',
    adding: false,
    addmenu: false,
    showimages: false,
    imagesId: [],
    showdesc: false,
    descData: '',
    errors: {
      title: '',
      desc: '',
      size: '',
      images: '',
      files: '',
      price: '',
    },
  })
}

function uploadImage(event: Event, index: number) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file)
    return

  const reader = new FileReader()
  reader.onloadend = () => {
    const base64String = (reader.result as string).split(',')[1]
    state.images[index] = `data:${file.type};base64,${base64String}`
  }
  reader.readAsDataURL(file)
}

function uploadFile(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file)
    state.files.push(URL.createObjectURL(file))
}

async function add() {
  state.errors = {
    title: state.title === '' ? 'Coloca un titulo' : '',
    desc: state.desc === '' ? 'Coloca una descripción' : '',
    size: state.size === '' ? 'Selecciona un tamaño' : '',
    images: state.images.length === 0 ? 'Agrega por lo menos una imagen' : '',
    files: state.files.length === 0 ? 'Agrega por lo menos un archivo' : '',
    price: state.price === '' ? 'Coloca el precio' : '',
  }

  const hasErrors = Object.values(state.errors).some(error => error !== '')
  if (hasErrors)
    return

  state.adding = true

  const [uploadedImages, uploadedFiles] = await Promise.all([
    $fetch('/api/images', { method: 'POST', body: state.images }),
    $fetch('/api/images', { method: 'POST', body: state.files }),
  ])

  if (uploadedImages && uploadedFiles) {
    await $fetch('/api/planos', {
      method: 'POST',
      body: {
        title: state.title,
        desc: state.desc,
        size: state.size,
        bathrooms: state.bathrooms,
        rooms: state.rooms,
        garages: state.garages,
        suites: state.suites,
        images: uploadedImages,
        files: uploadedFiles,
        price: state.price,
      },
    })
  }
  resetState()
  refresh()
}

async function del(id: string, images: string[]) {
  state.deleting = true
  await Promise.all([
    $fetch('/api/images', { body: images, method: 'DELETE' }),
    $fetch(`/api/planos/${id}`, { method: 'DELETE' }),
  ])
  refresh()
  state.deleting = false
}

function showImages(images: string[]) {
  state.showimages = true
  state.imagesId = images
}

function showDesc(desc: string) {
  state.showdesc = true
  state.descData = desc.replace(/<p><\/p>/g, '')
}
</script>

<template>
  <div class="max-w-1200px mx-auto px-6 pt-6">
    <h2 class="text-xl font-medium underline underline-verde-1">
      Planos
    </h2>
    <div class="pb-5 pt-5 border-b border-gris-800">
      <Button @click="state.addmenu = !state.addmenu">
        Add
        <UnoIcon class="i-ph-plus-bold h-4 w-4" />
      </Button>
    </div>
    <div v-if="pending || state.deleting || state.adding" class="text-center pt-5">
      Cargando...
    </div>
    <div v-else-if="!pending && !state.deleting && planos?.length === 0" class="text-center pt-5">
      No hay planos disponibles
    </div>
    <div v-else class="pt-5 grid lg:grid-cols-3 gap-3 sm:grid-cols-2 grid-cols-1">
      <div v-for="plano in planos" :key="plano.id" class="relative grid gap-2 bg-gris-900/30 rounded-lg">
        <div class="p-4 grid place-content-center h-70 font-medium z-1 text-center">
          {{ plano.title.toLocaleUpperCase() }}
        </div>

        <div class="absolute bottom-4 place-self-center p-2 bg-gris-900 rounded-lg z-2 px-3">
          <button class="text-gray-300 pr-2 border-r-2 text-sm border-gris-700" @click="showDesc(plano.desc)">
            Descripción
          </button>
          <button class="text-gray-300 pl-2 pr-2 border-r-2 text-sm border-gris-700" @click="showImages(plano.images)">
            Imágenes
          </button>
          <button class="text-red-500 hover:text-red-700 text-sm pl-2" @click="del(plano.id, plano.images)">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>

  <PlanosImagesModal :show="state.showimages" :images="state.imagesId" @close="state.showimages = false" />

  <Modal v-if="state.showdesc" top-0>
    <p class="text-xl font-medium underline underline-verde-1">
      Contenido
    </p>
    <div class="prose" v-html="state.descData" />
    <Button start rlg @click="state.showdesc = !state.showdesc">
      Cerrar
    </Button>
  </Modal>

  <Modal v-if="state.addmenu">
    <div class="flex justify-between">
      <h2 class="text-xl font-medium underline underline-verde-1">
        Planos
      </h2>
      <button @click="state.addmenu = !state.addmenu">
        <UnoIcon class="i-ph-x-bold h-5 w-5" />
      </button>
    </div>
    <div class="grid gap-1">
      <label class="text-sm font-medium">Titulo</label>
      <Input v-model="state.title" :disabled="pending || state.adding" />
      <div v-if="state.errors.title" class="text-red text-sm font-medium flex gap-1 items-center">
        <UnoIcon class="i-ph-warning h-4 w-4" />{{ state.errors.title }} .
      </div>
    </div>
    <div class="grid gap-1">
      <label class="text-sm font-medium">Descripción</label>
      <TipTap v-model="state.desc" :disabled="pending || state.adding" />
      <div v-if="state.errors.desc" class="text-red text-sm font-medium flex gap-1 items-center">
        <UnoIcon class="i-ph-warning h-4 w-4" />{{ state.errors.desc }} .
      </div>
    </div>
    <div class="grid gap-1">
      <label class="text-sm font-medium">Tamaño</label>
      <div v-if="!props.data" class="text-sm text-center text-gray-400">
        No hay tamaños disponibles
      </div>
      <div v-else class="flex flex-row items-stretch flex-initial flex-wrap gap-2">
        <button v-for="s in props.data" :key="s.id" :disabled="pending || state.adding || state.deleting" class="bg-gris-900 flex gap-1 items-center rounded-full px-2 py-1" @click="state.size === s.size ? state.size = '' : state.size = s.size">
          {{ s.size }}
          <UnoIcon v-if="state.size === s.size" class="i-ph-x-bold h-4 w-4" />
        </button>
      </div>
    </div>
    <Counter :disabled="pending || state.adding || state.deleting" :value="state.bathrooms" label="Baños" @update:value="state.bathrooms = $event" />
    <Counter :disabled="pending || state.adding || state.deleting" :value="state.rooms" label="Habitaciones" @update:value="state.rooms = $event" />
    <Counter :disabled="pending || state.adding || state.deleting" :value="state.garages" label="Garages" @update:value="state.garages = $event" />
    <Counter :disabled="pending || state.adding || state.deleting" :value="state.suites" label="Suites" @update:value="state.suites = $event" />
    <div class="grid gap-3">
      <label class="text-sm font-medium">Imágenes (hasta 5)</label>
      <div class="grid sm:grid-cols-3 grid-cols-2 gap-3">
        <div v-for="(square, index) in state.squares" :key="index">
          <input :id="`file${index}`" accept="image/*" :disabled="pending || state.adding" type="file" class="hidden" @change="uploadImage($event, index)">
          <label :for="`file${index}`">
            <div class="bg-gris-900/30 h-30 rounded-lg grid place-content-center overflow-hidden" :class="[!state.images[index] ? 'hover:bg-gris-900 transition-colors duration-200' : '']">
              <img v-if="state.images[index]" :src="state.images[index]" alt="Imagen subida" class="z-2 transition-all duration-200 hover:opacity-40 hover:blur-sm object-contain w-full h-full">
              <UnoIcon class="i-ph-plus-bold h-6 w-6 absolute place-self-center z-1" />
            </div>
          </label>
        </div>
      </div>
      <div v-if="state.errors.images" class="text-red text-sm font-medium flex gap-1 items-center">
        <UnoIcon class="i-ph-warning h-4 w-4" />{{ state.errors.images }} .
      </div>
    </div>
    <div class="grid gap-3">
      <label class="text-sm font-medium">Archivos</label>
      <div class="flex gap-2">
        <input id="pdf" :disabled="pending || state.adding" type="file" class="hidden" @change="uploadFile($event)">
        <label for="pdf" class="bg-gris-900/30 grid place-content-center hover:bg-gris-900 rounded-lg h-10 w-10">
          <UnoIcon class="i-ph-plus-bold" />
        </label>
      </div>
      <div v-for="(file, index) in state.files" :key="index" class="grid gap-1">
        <a :href="file" target="_blank" class="text-blue-600">{{ index + 1 }}</a>
      </div>
      <div v-if="state.errors.files" class="text-red text-sm font-medium flex gap-1 items-center">
        <UnoIcon class="i-ph-warning h-4 w-4" />{{ state.errors.files }} .
      </div>
    </div>
    <div class="grid gap-1">
      <label class="text-sm font-medium">Precio</label>
      <Input v-model="state.price" :disabled="pending || state.adding" />
      <div v-if="state.errors.price" class="text-red text-sm font-medium flex gap-1 items-center">
        <UnoIcon class="i-ph-warning h-4 w-4" />{{ state.errors.price }} .
      </div>
    </div>
    <Button :disabled="pending || state.adding" start rlg @click="add">
      Agregar
    </Button>
  </Modal>
</template>
