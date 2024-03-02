<script setup lang="ts">
import type { Asesoramiento } from '~/types'
import usePublicIdExtractor from '~/composables/extractPublicIds'

const { data: asesoramientos, refresh, pending } = useFetch('/api/asesoramientos')
definePageMeta({ layout: 'dashboard' })

interface Form {
  data: { title: string, desc: string, content: string }
  errors: { title: string, desc: string, content: string }
}

const form = ref<Form>({
  data: { title: '', desc: '', content: '' },
  errors: { title: '', desc: '', content: '' },
})

const editForm = ref<Form>({
  data: { title: '', desc: '', content: '' },
  errors: { title: '', desc: '', content: '' },
})

const { extractPublicIds } = usePublicIdExtractor()

interface State {
  addmenu: boolean
  adding: boolean
  deleting: boolean
  readMore: Record<string, boolean>
  currentReadMoreId: string
  currentReadMoreDesc: string
  oldcontent: string[]
  content: string
  viewcontent: boolean
  editmenu: boolean
  editId: string
}

const state = ref<State>({
  addmenu: false,
  adding: false,
  deleting: false,
  readMore: {},
  currentReadMoreId: '',
  currentReadMoreDesc: '',
  oldcontent: [],
  content: '',
  viewcontent: false,
  editmenu: false,
  editId: '',
})

function readMoreFunc(id: string, desc: string) {
  state.value.readMore[id] = true
  state.value.currentReadMoreId = id
  state.value.currentReadMoreDesc = desc
}

function closeReadMoreModal() {
  state.value.readMore[state.value.currentReadMoreId] = false
}

async function add() {
  form.value.errors = {
    title: form.value.data.title === '' ? 'Coloca un titulo' : '',
    desc: form.value.data.desc === '' ? 'Coloca una descripcion' : '',
    content: form.value.data.content === '' ? 'Coloca el contenido' : '',
  }

  const hasErrors = Object.values(form.value.errors).some(error => error !== '')
  if (!hasErrors) {
    state.value.adding = true
    await processForm(form.value.data)
    refresh()
    form.value.data = { title: '', desc: '', content: '' }
    state.value.adding = false
    state.value.addmenu = false
  }
}

async function edit(id: string) {
  editForm.value.errors = {
    title: editForm.value.data.title === '' ? 'Coloca un titulo' : '',
    desc: editForm.value.data.desc === '' ? 'Coloca una descripción' : '',
    content: editForm.value.data.content === '' ? 'Agrega el contenido' : '',
  }

  const hasErrors = Object.values(editForm.value.errors).some(error => error !== '')
  if (!hasErrors) {
    state.value.adding = true
    await processForm(editForm.value.data, id)
    refresh()
    state.value.adding = false
    state.value.editmenu = false
  }
}

async function processForm(data: { title: string, desc: string, content: string }, id = '') {
  const base64ImagePattern = /data:image\/[a-zA-Z]*;base64,[^"]*/g
  const base64Images = data.content.match(base64ImagePattern)

  if (base64Images !== null) {
    const images = await $fetch('/api/images', {
      method: 'POST',
      body: base64Images,
    })

    let newContent = data.content

    for (let i = 0; i < base64Images.length; i++)
      newContent = newContent.replace(base64Images[i], `https://res.cloudinary.com/dy4qbq4wj/image/upload/EstudioEHE/${images[i]}`)

    newContent = newContent.replace(/<p><\/p>/g, '')

    await ($fetch as any)(`/api/asesoramientos${id ? `/${id}` : ''}`, {
      method: id ? 'PUT' : 'POST',
      body: {
        title: data.title,
        desc: data.desc,
        content: newContent,
      },
    })
  }
  else {
    await ($fetch as any)(`/api/asesoramientos${id ? `/${id}` : ''}`, {
      method: id ? 'PUT' : 'POST',
      body: {
        title: data.title,
        desc: data.desc,
        content: data.content,
      },
    })
  }
}

async function del(id: string, content: string) {
  state.value.deleting = true
  const images = extractPublicIds(content)
  await $fetch('/api/images', {
    method: 'DELETE',
    body: images,
  })
  await $fetch(`/api/asesoramientos/${id}`, {
    method: 'DELETE',
  })
  refresh()
  state.value.deleting = false
}

function viewContent(contentstring: string) {
  state.value.viewcontent = true
  state.value.content = contentstring
}

function editMenu(asesoramiento: Asesoramiento) {
  state.value.editmenu = true
  const publicIds = extractPublicIds(asesoramiento.content)

  if (publicIds !== null)
    state.value.oldcontent = publicIds

  editForm.value.data = {
    title: asesoramiento.title,
    desc: asesoramiento.desc,
    content: asesoramiento.content,
  }

  if (asesoramiento.id)
    state.value.editId = asesoramiento.id
}
</script>

<template>
  <div>
    <div class="max-w-1200px mx-auto px-6 pt-6">
      <h2 class="text-xl font-medium underline underline-verde-1">
        Asesoramiento
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
      <div v-else-if="!pending && !state.deleting && asesoramientos?.length === 0" class="text-center pt-5">
        No hay creaciones disponibles
      </div>
      <div v-else class="pt-5 grid md:grid-cols-3 gap-3 sm:grid-cols-2 grid-cols-1 mb-5">
        <div v-for="asesoramiento in asesoramientos" :key="asesoramiento.id" class="relative h-70 grid place-content-center gap-2 bg-gris-900/30 rounded-lg p-4 ">
          <h2 class="font-medium text-lg text-center">
            {{ asesoramiento.title }}
          </h2>
          <div class="text-white/70 text-center flex flex-col">
            {{ asesoramiento.desc.length > 100 ? `${asesoramiento.desc.substring(0, 100)}...` : asesoramiento.desc }}
            <button v-if="asesoramiento.desc.length > 100" class="text-blue-500 hover:opacity-80" @click="readMoreFunc(asesoramiento.id, asesoramiento.desc)">
              Leer mas .
            </button>
          </div>

          <div class="absolute place-self-center bottom-4 p-2 bg-gris-900 rounded-lg z-2 px-3">
            <button class="text-gray-300 pr-2 border-r-2 text-sm border-gris-700" @click="viewContent(asesoramiento.content)">
              Ver mas
            </button>
            <button class="text-gray-300 pl-2 pr-2 border-r-2 text-sm border-gris-700" @click="editMenu(asesoramiento)">
              Editar
            </button>
            <button class="text-red-500 hover:text-red-700 text-sm pl-2" @click="del(asesoramiento.id, asesoramiento.content)">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Modal v-if="Object.values(state.readMore).some(value => value)">
    <div class="flex justify-between">
      <h1 class="text-xl font-medium underline underline-verde-1">
        Leer Mas
      </h1>
      <button @click="closeReadMoreModal">
        <UnoIcon class="i-ph-x-bold h-5 w-5" />
      </button>
    </div>
    <div>
      {{ state.currentReadMoreDesc }}
    </div>
  </Modal>

  <Modal v-if="state.editmenu">
    <div class="flex justify-between">
      <p class="text-xl font-medium underline underline-verde-1">
        Asesoramiento
      </p>
      <button @click="state.editmenu = !state.editmenu">
        <UnoIcon class="i-ph-x-bold h-5 w-5" />
      </button>
    </div>
    <div class="grid gap-1">
      <label class="text-sm font-medium">Titulo</label>
      <Input v-model="editForm.data.title" :disabled="pending || state.adding" />
      <div v-if="editForm.errors.title" class="text-red text-sm font-medium flex gap-1 items-center">
        <UnoIcon class="i-ph-warning h-4 w-4" />{{ editForm.errors.title }} .
      </div>
    </div>
    <div class="grid gap-1">
      <label class="text-sm font-medium">Descripción</label>
      <Input v-model="editForm.data.desc" textarea :disabled="pending || state.adding" />
      <div v-if="editForm.errors.desc" class="text-red text-sm font-medium flex gap-1 items-center">
        <UnoIcon class="i-ph-warning h-4 w-4" />{{ editForm.errors.desc }} .
      </div>
    </div>
    <div class="grid gap-3">
      <label class="text-sm font-medium">Contenido</label>
      <TipTap v-model:modelValue="editForm.data.content" image />
    </div>
    <span v-if="pending || state.adding">
      <UnoIcon class="i-eos-icons-loading w-8 h-8" />
    </span>
    <Button v-else :disabled="pending || state.adding" start rlg @click="edit(state.editId)">
      Editar
    </Button>
  </Modal>

  <Modal v-if="state.viewcontent" top0>
    <p class="text-xl font-medium underline underline-verde-1">
      Contenido
    </p>
    <div class="prose" v-html="state.content" />

    <Button start rlg @click="state.viewcontent = !state.viewcontent">
      Cerrar
    </Button>
  </Modal>

  <Modal v-if="state.addmenu">
    <div class="flex justify-between">
      <h1 class="text-xl font-medium underline underline-verde-1">
        Creaciones
      </h1>
      <button @click="state.addmenu = !state.addmenu">
        <UnoIcon class="i-ph-x-bold h-5 w-5" />
      </button>
    </div>
    <div class="grid gap-1">
      <label class="text-sm font-medium">Titulo</label>
      <Input v-model="form.data.title" :disabled="pending || state.adding" />
      <div v-if="form.errors.title" class="text-red text-sm font-medium flex gap-1 items-center">
        <UnoIcon class="i-ph-warning h-4 w-4" />{{ form.errors.title }} .
      </div>
    </div>
    <div class="grid gap-1">
      <label class="text-sm font-medium">Descripción</label>
      <Input v-model="form.data.desc" :disabled="pending || state.adding" />
      <div v-if="form.errors.desc" class="text-red text-sm font-medium flex gap-1 items-center">
        <UnoIcon class="i-ph-warning h-4 w-4" />{{ form.errors.desc }} .
      </div>
    </div>
    <div class="grid gap-1">
      <label class="text-sm font-medium">Contenido</label>
      <TipTap v-model:modelValue="form.data.content" image />
      <div v-if="form.errors.content" class="text-red text-sm font-medium flex gap-1 items-center">
        <UnoIcon class="i-ph-warning h-4 w-4" />{{ form.errors.content }} .
      </div>
    </div>
    <span v-if="pending || state.adding">
      <UnoIcon class="i-eos-icons-loading w-8 h-8" />
    </span>
    <Button v-else :disabled="pending || state.adding" start rlg @click="add">
      Agregar
    </Button>
  </Modal>
</template>

<style>
.prose img{
  border-radius: 0.5rem;
}
</style>
