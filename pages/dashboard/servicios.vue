<script setup lang="ts">
import type { Servicio } from '~/types'

const { data: servicios, refresh, pending } = await useFetch('/api/servicios')
definePageMeta({ layout: 'dashboard' })

const createEmptyServicio = (): Servicio => ({ title: '', desc: '', image: '' })

const data = ref(createEmptyServicio())
const errors = ref(createEmptyServicio())
const editData = ref(createEmptyServicio())
const editErrors = ref(createEmptyServicio())

function uploadImage(event: Event, target: Ref<Servicio>) {
  const inputElement = event.target as HTMLInputElement
  if (inputElement.files) {
    const file = inputElement.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = function () {
        const base64String = (reader.result as string).split(',')[1]
        const preparedBase64String = `data:${file.type};base64,${base64String}`
        target.value.image = preparedBase64String
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

function validate(target: Ref<Servicio>, errors: Ref<Servicio>) {
  errors.value = {
    title: target.value.title === '' ? 'Coloca un titulo' : '',
    desc: target.value.desc === '' ? 'Coloca una descripción' : '',
    image: target.value.image.length === 0 ? 'Agrega la imagen' : '',
  }
  return !Object.values(errors.value).some(error => error !== '')
}

function reset(target: Ref<Servicio>, errors: Ref<Servicio>) {
  target.value = createEmptyServicio()
  errors.value = createEmptyServicio()
}

async function add() {
  if (validate(data, errors)) {
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
    reset(data, errors)
    adding.value = false
    addmenu.value = false
  }
}

async function edit(id: string) {
  if (validate(editData, editErrors)) {
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
    reset(editData, editErrors)
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
  editData.value = { ...servicio }
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
        <div v-for="servicio in servicios" :key="servicio.id" class="grid p-4 sm:grid-rows-[1fr_auto] gap-2 bg-gris-900/30 rounded-lg">
          <div class="flex flex-col items-start">
            <h2 class="font-medium text-lg">
              {{ servicio.title }}
            </h2>
            <p class="text-white/70">
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
            <button v-if="servicio.desc.length > 100" class="text-blue-500 hover:opacity-80" @click="readMoreFunc(servicio.id, servicio.desc)">
              Leer mas .
            </button>
          </div>

          <div class="grid gap-3">
            <div>
              <span v-if="loadingImages[servicio.id]" class="w-full h-252px grid place-content-center"><UnoIcon class="i-line-md-loading-loop w-10 h-10" /></span>
              <NuxtImg v-else :src="servicio.image" provider="cloudinary" width="400" height="300" class="rounded-lg" @error="loadingImages[servicio.id] = true" />
            </div>

            <div class="place-self-center p-2 bg-gris-900 rounded-lg z-2 px-3">
              <button class="text-gray-300 pr-2 border-r-2 text-sm border-gris-700" @click="editMenu(servicio)">
                Editar
              </button>
              <button class="text-red-500 hover:text-red-700 text-sm pl-2" @click="del(servicio.id, servicio.image)">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Modal v-if="menu">
    <div class="flex justify-between">
      <h2 class="text-xl font-medium underline underline-verde-1">
        Editar
      </h2>
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
      <TipTap v-model:modelValue="editData.desc" />
      <div v-if="editErrors.desc" class="text-red text-sm font-medium flex gap-1 items-center">
        <UnoIcon class="i-ph-warning h-4 w-4" />{{ editErrors.desc }} .
      </div>
    </div>
    <div class="grid gap-3">
      <label class="text-sm font-medium">Imagen</label>
      <div>
        <div>
          <input id="file" :disabled="pending || adding" type="file" class="hidden" @change="uploadImage($event, ref(editData))">
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

  <Modal v-if="Object.values(readMore).some(value => value)" top0>
    <div class="flex justify-between">
      <h2 class="text-xl font-medium underline underline-verde-1">
        Leer Mas
      </h2>
      <button @click="closeReadMoreModal">
        <UnoIcon class="i-ph-x-bold h-5 w-5" />
      </button>
    </div>
    <div class="prose" v-html="currentReadMoreDesc" />
  </Modal>

  <Modal v-if="addmenu">
    <div class="flex justify-between">
      <h2 class="text-xl font-medium underline underline-verde-1">
        Servicios
      </h2>
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
      <TipTap v-model:modelValue="data.desc" :disabled="pending || adding" />
      <div v-if="errors.desc" class="text-red text-sm font-medium flex gap-1 items-center">
        <UnoIcon class="i-ph-warning h-4 w-4" />{{ errors.desc }} .
      </div>
    </div>
    <div class="grid gap-3">
      <label class="text-sm font-medium">Imagen</label>
      <div>
        <div>
          <input id="file" accept="image/*" :disabled="pending || adding" type="file" class="hidden" @change="uploadImage($event, ref(data))">
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
