<script setup lang="ts">
const { data: creaciones, refresh, pending } = await useFetch('/api/creaciones')
definePageMeta({
  layout: 'dashboard',
})

const data = ref({
  title: '',
  url: '',
})

const errors = ref({
  title: '',
  url: '',
})

const editData = ref({
  title: '',
  url: '',
})

const editErrors = ref({
  title: '',
  url: '',
})

const addmenu = ref(false)
const editmenu = ref(false)
const adding = ref(false)
const deleting = ref(false)
const editId = ref('')

async function add() {
  errors.value = {
    title: data.value.title === '' ? 'Coloca un titulo' : '',
    url: data.value.url === '' ? 'Coloca un url' : '',
  }

  const hasErrors = Object.values(errors.value).some(error => error !== '')

  if (!hasErrors) {
    adding.value = true

    await $fetch('/api/creaciones', {

      method: 'POST',
      body: {
        title: data.value.title,
        url: data.value.url,
      },

    })

    refresh()
    data.value = {
      title: '',
      url: '',
    }
    adding.value = false
    addmenu.value = false
  }
}

async function edit(id: string) {
  editErrors.value = {
    title: editData.value.title === '' ? 'Coloca un titulo' : '',
    url: editData.value.url === '' ? 'Coloca un url' : '',
  }

  const hasErrors = Object.values(errors.value).some(error => error !== '')

  if (!hasErrors) {
    adding.value = true

    await $fetch(`/api/creaciones/${id}`, {

      method: 'PUT',
      body: {
        title: editData.value.title,
        url: editData.value.url,
      },

    })

    refresh()
    editData.value = {
      title: '',
      url: '',
    }
    adding.value = false
    editmenu.value = false
  }
}

function editing(creacion: { id: string, title: string, url: string }) {
  editmenu.value = true
  editData.value = {
    title: creacion.title,
    url: creacion.url,
  }
  editId.value = creacion.id
}
</script>

<template>
  <div>
    <div class="max-w-1200px mx-auto px-6 pt-6">
      <h2 class="text-xl font-medium underline underline-verde-1">
        Creaciones
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
      <div v-else-if="!pending && !deleting && creaciones?.length === 0" class="text-center pt-5">
        No hay servicios disponibles
      </div>
      <div v-else class="pt-5 grid md:grid-cols-3 gap-3 sm:grid-cols-2 grid-cols-1 mb-5">
        <div v-for="(creacion) in creaciones" :key="creacion.id" class="relative grid gap-2 bg-gris-900/30 rounded-lg">
          <NuxtLink class="p-2 grid place-content-center h-70 font-medium z-1 text-center" :to="creacion.url" target="_BLANK">
            {{ creacion.title.toLocaleUpperCase() }}
          </NuxtLink>

          <div class="absolute bottom-4 place-self-center p-2 bg-gris-900 rounded-lg z-2 px-3">
            <button class="text-gray-300 pr-2 border-r-2 text-sm border-gris-700" @click="editing(creacion)">
              Editar
            </button>
            <button class="text-red-500 hover:text-red-700 text-sm pl-2" @click="del(creacion.id)">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Modal v-if="editmenu">
    <div class="flex justify-between">
      <h1 class="text-xl font-medium underline underline-verde-1">
        Editar
      </h1>
      <button @click="editmenu = !editmenu">
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
      <label class="text-sm font-medium">Url</label>
      <Input v-model="editData.url" :disabled="pending || adding" />
      <div v-if="editErrors.url" class="text-red text-sm font-medium flex gap-1 items-center">
        <UnoIcon class="i-ph-warning h-4 w-4" />{{ editErrors.url }} .
      </div>
    </div>
    <span v-if="pending || adding">
      <UnoIcon class="i-eos-icons-loading w-8 h-8" />
    </span>
    <Button v-else :disabled="pending || adding" start rlg @click="edit(editId)">
      Editar
    </Button>
  </Modal>

  <Modal v-if="addmenu">
    <div class="flex justify-between">
      <h1 class="text-xl font-medium underline underline-verde-1">
        Creaciones
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
      <label class="text-sm font-medium">Url</label>
      <Input v-model="data.url" :disabled="pending || adding" />
      <div v-if="errors.url" class="text-red text-sm font-medium flex gap-1 items-center">
        <UnoIcon class="i-ph-warning h-4 w-4" />{{ errors.url }} .
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
