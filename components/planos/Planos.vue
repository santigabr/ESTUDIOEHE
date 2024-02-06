<script setup lang="ts">
const props = defineProps<{ data: { id: string, size: string }[] | null }>()

const { data: planos, refresh, pending } = await useFetch('/api/planos')
const { data: planosfiles, refresh: refreshplanos } = await useFetch('/api/files')

const addmenu = ref(false)
const images = ref<string[]>([])
const squares = ref<Array<string | null>>(Array(5).fill(null))
const files = ref<{ url: string, name: string }[]>([])
const title = ref('')
const desc = ref('')
const size = ref('')
const bathrooms = ref(0)
const rooms = ref(0)
const suites = ref(0)
const garages = ref(0)
const price = ref('')
const deleting = ref(false)
const adding = ref(false)

const errors = ref({
  title: '',
  desc: '',
  size: '',
  images: '',
  files: '',
  price: '',
})

function uploadImage(event: Event, index: number) {
  const inputElement = event.target as HTMLInputElement
  if (inputElement.files) {
    const file = inputElement.files[0]
    if (file)
      images.value[index] = URL.createObjectURL(file)
  }
}

function uploadPDF(event: Event) {
  const inputElement = event.target as HTMLInputElement
  if (inputElement.files) {
    const file = inputElement.files[0]
    if (file)
      files.value.push({ url: URL.createObjectURL(file), name: file.name })
  }
}

async function add() {
  errors.value = {
    title: title.value === '' ? 'Coloca un titulo' : '',
    desc: desc.value === '' ? 'Coloca una descripción' : '',
    size: size.value === '' ? 'Selecciona un tamaño' : '',
    images: images.value.length === 0 ? 'Agrega por lo menos una imagen' : '',
    files: files.value.length === 0 ? 'Agrega por lo menos un archivo' : '',
    price: price.value === '' ? 'Coloca el precio' : '',
  }

  const hasErrors = Object.values(errors.value).some(error => error !== '')

  if (!hasErrors) {
    await $fetch('/api/planos', {
      method: 'POST',
      body: {
        title: title.value,
        desc: desc.value,
        size: size.value,
        bathrooms: bathrooms.value,
        rooms: rooms.value,
        garages: garages.value,
        suites: suites.value,
        images: images.value,
        files: files.value,
        price: price.value,
      },
    })

    refresh()
    refreshplanos()
    title.value = ''
    desc.value = ''
    size.value = ''
    bathrooms.value = 0
    rooms.value = 0
    garages.value = 0
    suites.value = 0
    images.value = []
    files.value = []
    price.value = ''
    addmenu.value = false
  }
}

async function del(id: string) {
  const filesToDelete = planosfiles.value?.filter(file => file.planosId === id).map(file => file.id)

  if (filesToDelete) {
    await Promise.all(
      filesToDelete.map(async (file) => {
        await fetch(`/api/files/${file}`, {
          method: 'DELETE',
        })
      }),
    )
  }

  await $fetch(`/api/planos/${id}`, {
    method: 'DELETE',
  })

  refresh()
}
</script>

<template>
  <div class="max-w-1200px mx-auto px-6 pt-6">
    <h2 class="text-xl font-medium underline underline-verde-1">
      Planos
    </h2>
    <div class="pb-5 pt-5 border-b border-gris-800">
      <Button @click="addmenu = !addmenu">
        Add
        <UnoIcon class="i-ph-plus-bold h-4 w-4" />
      </Button>
    </div>
    <div v-if="pending || deleting || adding" class="text-center pt-5">
      Cargando...
    </div>
    <div v-else-if="!pending && !deleting && planos?.length === 0" class="text-center pt-5">
      No hay planos disponibles
    </div>
    <div v-else class="pt-5 grid md:grid-cols-3 gap-3 sm:grid-cols-2 grid-cols-1">
      <div v-for="plano in planos" :key="plano.id" class="bg-gris-900/30 grid gap-2 p-4 rounded-lg">
        <h2>{{ plano.title }}</h2>
        <p>{{ plano.desc }}</p>
        <img v-for="img in plano.images" :key="img" :src="img">
        <NuxtLink v-for="file in planosfiles?.filter(file => file.planosId === plano.id)" :key="file.id" :to="file.url" target="_BLANK">
          {{ file.name }}
        </NuxtLink>
        <button
          @click="del(plano.id)"
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>

  <Modal v-if="addmenu">
    <div class="flex justify-between">
      <h1 class="text-xl font-medium underline underline-verde-1">
        Planos
      </h1>
      <button @click="addmenu = !addmenu">
        <UnoIcon class="i-ph-x-bold h-5 w-5" />
      </button>
    </div>
    <div class="grid gap-1">
      <label class="text-sm font-medium">Titulo</label>
      <Input v-model="title" />
      <div v-if="errors.title" class="text-red text-sm font-medium flex gap-1 items-center">
        <UnoIcon class="i-ph-warning h-4 w-4" />{{ errors.title }} .
      </div>
    </div>
    <div class="grid gap-1">
      <label class="text-sm font-medium">Descripción</label>
      <Input v-model="desc" />
      <div v-if="errors.desc" class="text-red text-sm font-medium flex gap-1 items-center">
        <UnoIcon class="i-ph-warning h-4 w-4" />{{ errors.desc }} .
      </div>
    </div>
    <div class="grid gap-1">
      <label class="text-sm font-medium">Tamaño</label>
      <div v-if="!props.data" class="text-sm text-center text-gray-400">
        No hay tamaños disponibles
      </div>
      <div v-else class="flex flex-row items-stretch flex-initial flex-wrap gap-2">
        <button v-for="s in props.data" :key="s.id" class="bg-gris-900 flex gap-1 items-center rounded-full px-3 py-2" @click="size === s.size ? size = '' : size = s.size">
          {{ s.size }}
          <UnoIcon v-if="size === s.size" class="i-ph-x-bold h-4 w-4" />
        </button>
      </div>
    </div>
    <Counter :value="bathrooms" label="Baños" @update:value="bathrooms = $event" />
    <Counter :value="rooms" label="Habitaciones" @update:value="rooms = $event" />
    <Counter :value="garages" label="Garages" @update:value="garages = $event" />
    <Counter :value="suites" label="Suites" @update:value="suites = $event" />
    <div class="grid gap-3">
      <label class="text-sm font-medium">Imágenes (hasta 5)</label>
      <div class="grid sm:grid-cols-3 grid-cols-2 gap-3">
        <div v-for="(square, index) in squares" :key="index">
          <input :id="`file${index}`" type="file" class="hidden" @change="uploadImage($event, index)">
          <label :for="`file${index}`">
            <div class="bg-gris-900/30 h-30 rounded-lg grid place-content-center overflow-hidden" :class="[!images[index] ? 'hover:bg-gris-900 transition-colors duration-200' : '']">
              <img v-if="images[index]" :src="images[index]" alt="Imagen subida" class="z-2 transition-all duration-200 hover:opacity-40 hover:blur-sm object-contain w-full h-full">
              <UnoIcon class="i-ph-plus-bold h-6 w-6 absolute place-self-center z-1" />
            </div>
          </label>
        </div>
      </div>
      <div v-if="errors.images" class="text-red text-sm font-medium flex gap-1 items-center">
        <UnoIcon class="i-ph-warning h-4 w-4" />{{ errors.images }} .
      </div>
    </div>
    <div class="grid gap-3">
      <label class="text-sm font-medium">Archivos</label>
      <div class="flex gap-2">
        <input id="pdf" type="file" class="hidden" @change="uploadPDF($event)">
        <label for="pdf" class="bg-gris-900/30 grid place-content-center hover:bg-gris-900 rounded-lg h-10 w-10">
          <UnoIcon class="i-ph-plus-bold" />
        </label>
      </div>
      <div v-for="(pdf, index) in files" :key="index" class="grid gap-1">
        <a :href="pdf.url" target="_blank" class="text-blue-600">{{ pdf.name }}</a>
      </div>
      <div v-if="errors.files" class="text-red text-sm font-medium flex gap-1 items-center">
        <UnoIcon class="i-ph-warning h-4 w-4" />{{ errors.files }} .
      </div>
    </div>
    <div class="grid gap-1">
      <label class="text-sm font-medium">Precio</label>
      <Input v-model="price" />
      <div v-if="errors.price" class="text-red text-sm font-medium flex gap-1 items-center">
        <UnoIcon class="i-ph-warning h-4 w-4" />{{ errors.price }} .
      </div>
    </div>
    <Button start rlg @click="add">
      Agregar
    </Button>
  </Modal>
</template>
