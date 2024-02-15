<script setup lang="ts">
import type { Servicio } from '~/types'

const { data: servicios, refresh, pending } = await useFetch('/api/servicios')

definePageMeta({
  layout: 'dashboard',
})

const data = ref<Servicio>({
  title: '',
  desc: '',
  image: '',
})

const errors = ref({
  title: '',
  desc: '',
  image: '',
})

const editData = ref<Servicio>({
  title: '',
  desc: '',
  image: '',
})

const editErrors = ref({
  title: '',
  desc: '',
  image: '',
})

function uploadImage(event: Event) {
  const inputElement = event.target as HTMLInputElement

  if (inputElement.files) {
    const file = inputElement.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = function () {
        const base64String = (reader.result as string).split(',')[1]
        const preparedBase64String = `data:${file.type};base64,${base64String}`
        data.value.image = preparedBase64String
      }
      reader.readAsDataURL(file)
    }
  }
}

function uploadEditImage(event: Event) {
  const inputElement = event.target as HTMLInputElement

  if (inputElement.files) {
    const file = inputElement.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = function () {
        const base64String = (reader.result as string).split(',')[1]
        const preparedBase64String = `data:${file.type};base64,${base64String}`
        editData.value.image = preparedBase64String
      }
      reader.readAsDataURL(file)
    }
  }
}

const adding = ref(false)
const addmenu = ref(false)
const deleting = ref(false)
const readMore = ref<Record<string, boolean>>({})
const currentReadMoreId = ref('')
const currentReadMoreDesc = ref('')
const open = ref<Record<string, boolean>>({})
const loadingImages = ref<Record<string, boolean>>({})
const editImage = ref('')
const editId = ref('')
const menu = ref(false)

function readMoreFunc(id: string, desc: string) {
  readMore.value[id] = true
  currentReadMoreId.value = id
  currentReadMoreDesc.value = desc
}

function closeReadMoreModal() {
  readMore.value[currentReadMoreId.value] = false
}

async function add() {
  errors.value = {
    title: data.value.title === '' ? 'Coloca un titulo' : '',
    desc: data.value.desc === '' ? 'Coloca una descripción' : '',
    image: data.value.image.length === 0 ? 'Agrega la imagen' : '',
  }

  const hasErrors = Object.values(errors.value).some(error => error !== '')

  if (!hasErrors) {
    adding.value = true

    const uploadedImage = await $fetch('/api/images/1', {
      method: 'POST',
      body: { image: data.value.image },
    })

    if (uploadedImage) {
      await $fetch('/api/servicios', {

        method: 'POST',
        body: {
          title: data.value.title,
          desc: data.value.desc,
          image: uploadedImage,
        },

      })
    }
    refresh()
    data.value = {
      title: '',
      desc: '',
      image: '',
    }
    adding.value = false
    addmenu.value = false
  }
}

async function edit(id: string) {
  editErrors.value = {
    title: editData.value.title === '' ? 'Coloca un titulo' : '',
    desc: editData.value.desc === '' ? 'Coloca una descripción' : '',
    image: editData.value.image.length === 0 ? 'Agrega la imagen' : '',
  }

  const hasErrors = Object.values(errors.value).some(error => error !== '')

  if (!hasErrors) {
    adding.value = true

    const editingImage = await $fetch('/api/images/1', {
      method: 'PUT',
      body: { editimage: editImage.value, image: editData.value.image },
    })

    if (editingImage) {
      await $fetch(`/api/servicios/${id}`, {

        method: 'PUT',
        body: {
          title: editData.value.title,
          desc: editData.value.desc,
          image: editingImage,
        },

      })
    }
    refresh()
    editData.value = {
      title: '',
      desc: '',
      image: '',
    }
    adding.value = false
    menu.value = false
  }
}

async function del(id: string, image: string) {
  deleting.value = true
  await $fetch('/api/images/1', {
    body: { image },
    method: 'DELETE',
  })
  await $fetch(`/api/servicios/${id}`, {
    method: 'DELETE',
  })
  refresh()
  deleting.value = false
}

function editMenu(servicio: Servicio) {
  menu.value = true
  editData.value = {
    title: servicio.title,
    desc: servicio.desc,
    image: servicio.image,
  }
  editImage.value = servicio.image
  if (servicio.id)
    editId.value = servicio.id
}
</script>

<template>
  <div>
    <div class="max-w-1200px mx-auto px-6 pt-6">
      <h2 class="text-xl font-medium underline underline-verde-1">
        Servicios
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
      <div v-else-if="!pending && !deleting && servicios?.length === 0" class="text-center pt-5">
        No hay servicios disponibles
      </div>
      <div v-else class="pt-5 grid md:grid-cols-3 gap-3 sm:grid-cols-2 grid-cols-1 mb-5">
        <div v-for="(servicio, index) in servicios" :key="servicio.id" class="grid p-2 sm:grid-rows-[1fr_auto] gap-2 bg-gris-900/30 rounded-lg">
          <div class="grid gap-2 pt-3 px-3">
            <div class="flex flex-col items-start">
              <h2 class="font-medium text-lg">
                {{ servicio.title }}
              </h2>
              <p class="text-white/70">
                {{ servicio.desc.length > 100 ? `${servicio.desc.substring(0, 100)}...` : servicio.desc }}
              </p>
              <button v-if="servicio.desc.length > 100" class="text-blue-500 hover:opacity-80" @click="readMoreFunc(servicio.id, servicio.desc)">
                Leer mas .
              </button>
            </div>
          </div>
          <div class="grid gap-2">
            <div class="px-3">
              <span v-if="loadingImages[servicio.id]" class="w-full h-252px grid place-content-center"><UnoIcon class="i-line-md-loading-loop w-10 h-10" /></span>
              <NuxtImg v-else :src="servicio.image" provider="cloudinary" width="400" height="300" class="rounded-lg" @error="loadingImages[servicio.id] = true" />
            </div>
            <div class="relative inline-block text-left" @click="open[index] = !open[index]">
              <div>
                <button type="button" class="inline-flex justify-center w-full rounded-md px-4 py-2 bg-gris-900 border-gris-900 border text-sm font-medium">
                  Acciones
                  <svg class="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 12a2 2 0 110-4 2 2 0 010 4zm0-6a2 2 0 110-4 2 2 0 010 4zm0 12a2 2 0 110-4 2 2 0 010 4z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>

              <div v-show="open[index]" class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gris-900 ring-1 ring-black ring-opacity-5">
                <div class="py-1" role="menu" aria-orientation="vertical">
                  <a href="#" class="block px-4 py-2 text-sm hover:bg-gris-700" role="menuitem" @click="editMenu(servicio)">Editar</a>
                  <a href="#" class="block px-4 py-2 text-sm hover:bg-gris-700" role="menuitem" @click="del(servicio.id, servicio.image)">Eliminar</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Modal v-if="menu">
    <div class="flex justify-between">
      <h1 class="text-xl font-medium underline underline-verde-1">
        Editar
      </h1>
      <button @click="menu = !menu">
        <UnoIcon class="i-ph-x-bold h-5 w-5" />
      </button>
    </div>
    <div class="grid gap-1">
      <label class="text-sm font-medium">Titulo</label>
      <Input v-model="editData.title" :disabled="pending || adding" />
      <div v-if="editErrors.title" class="text-red text-sm font-medium flex gap-1 items-center">
        <UnoIcon class="i-ph-warning h-4 w-4" />{{ editErrors.title }} .
      </div>
    </div>
    <div class="grid gap-1">
      <label class="text-sm font-medium">Descripción</label>
      <Input v-model="editData.desc" textarea :disabled="pending || adding" />
      <div v-if="editErrors.desc" class="text-red text-sm font-medium flex gap-1 items-center">
        <UnoIcon class="i-ph-warning h-4 w-4" />{{ editErrors.desc }} .
      </div>
    </div>
    <div class="grid gap-3">
      <label class="text-sm font-medium">Imagen</label>
      <div>
        <div>
          <input id="file" :disabled="pending || adding" type="file" class="hidden" @change="uploadEditImage($event)">
          <label for="file">
            <div class="bg-gris-900/30 h-50 sm:w-50 rounded-lg grid place-content-center overflow-hidden" :class="[!data.image ? 'hover:bg-gris-900 transition-colors duration-200' : '']">
              <NuxtImg v-if="editData.image" :src="editData.image" alt="Imagen subida" class="z-2 transition-all duration-200 hover:opacity-40 hover:blur-sm object-contain w-full h-full" provider="cloudinary" />
              <UnoIcon class="i-ph-plus-bold h-6 w-6 absolute place-self-center z-1" />
            </div>
          </label>
        </div>
      </div>
      <div v-if="editErrors.image" class="text-red text-sm font-medium flex gap-1 items-center">
        <UnoIcon class="i-ph-warning h-4 w-4" />{{ editErrors.image }} .
      </div>
    </div>
    <span v-if="pending || adding">
      <UnoIcon class="i-eos-icons-loading w-8 h-8" />
    </span>
    <Button v-else :disabled="pending || adding" start rlg @click="edit(editId)">
      Editar
    </Button>
  </Modal>

  <Modal v-if="Object.values(readMore).some(value => value)">
    <div class="flex justify-between">
      <h1 class="text-xl font-medium underline underline-verde-1">
        Leer Mas
      </h1>
      <button @click="closeReadMoreModal">
        <UnoIcon class="i-ph-x-bold h-5 w-5" />
      </button>
    </div>
    <div>
      {{ currentReadMoreDesc }}
    </div>
  </Modal>

  <Modal v-if="addmenu">
    <div class="flex justify-between">
      <h1 class="text-xl font-medium underline underline-verde-1">
        Servicios
      </h1>
      <button @click="addmenu = !addmenu">
        <UnoIcon class="i-ph-x-bold h-5 w-5" />
      </button>
    </div>
    <div class="grid gap-1">
      <label class="text-sm font-medium">Titulo</label>
      <Input v-model="data.title" :disabled="pending || adding" />
      <div v-if="errors.title" class="text-red text-sm font-medium flex gap-1 items-center">
        <UnoIcon class="i-ph-warning h-4 w-4" />{{ errors.title }} .
      </div>
    </div>
    <div class="grid gap-1">
      <label class="text-sm font-medium">Descripción</label>
      <Input v-model="data.desc" textarea :disabled="pending || adding" />
      <div v-if="errors.desc" class="text-red text-sm font-medium flex gap-1 items-center">
        <UnoIcon class="i-ph-warning h-4 w-4" />{{ errors.desc }} .
      </div>
    </div>
    <div class="grid gap-3">
      <label class="text-sm font-medium">Imagen</label>
      <div>
        <div>
          <input id="file" :disabled="pending || adding" type="file" class="hidden" @change="uploadImage($event)">
          <label for="file">
            <div class="bg-gris-900/30 h-50 sm:w-50 rounded-lg grid place-content-center overflow-hidden" :class="[!data.image ? 'hover:bg-gris-900 transition-colors duration-200' : '']">
              <img v-if="data.image" :src="data.image" alt="Imagen subida" class="z-2 transition-all duration-200 hover:opacity-40 hover:blur-sm object-contain w-full h-full">
              <UnoIcon class="i-ph-plus-bold h-6 w-6 absolute place-self-center z-1" />
            </div>
          </label>
        </div>
      </div>
      <div v-if="errors.image" class="text-red text-sm font-medium flex gap-1 items-center">
        <UnoIcon class="i-ph-warning h-4 w-4" />{{ errors.image }} .
      </div>
    </div>
    <span v-if="pending || adding">
      <UnoIcon class="i-eos-icons-loading w-8 h-8" />
    </span>
    <Button v-else :disabled="pending || adding" start rlg @click="add">
      Agregar
    </Button>
  </Modal>
</template>
