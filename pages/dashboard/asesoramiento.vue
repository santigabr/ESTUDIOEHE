<script setup lang="ts">
const { data: asesoramientos, refresh, pending } = await useFetch('/api/asesoramientos')
definePageMeta({
  layout: 'dashboard',
})

const data = ref({
  title: '',
  desc: '',
  content: '',
})

const errors = ref({
  title: '',
  desc: '',
  content: '',
})

const addmenu = ref(false)
const adding = ref(false)
const deleting = ref(false)

async function add() {
  errors.value = {
    title: data.value.title === '' ? 'Coloca un titulo' : '',
    desc: data.value.desc === '' ? 'Coloca una descripcion' : '',
    content: data.value.content === '' ? 'Coloca el contenido' : '',
  }

  const base64ImagePattern = /data:image\/[a-zA-Z]*;base64,[^"]*/g
  const base64Images = data.value.content.match(base64ImagePattern)

  const hasErrors = Object.values(errors.value).some(error => error !== '')

  if (!hasErrors) {
    adding.value = true

    if (base64Images !== null) {
      const images = await $fetch('/api/images', {
        method: 'POST',
        body: base64Images,
      })

      let newContent = data.value.content
      for (let i = 0; i < base64Images.length; i++)
        newContent = newContent.replace(base64Images[i], images[i])

      await $fetch('/api/asesoramientos', {
        method: 'POST',
        body: {
          title: data.value.title,
          desc: data.value.desc,
          content: newContent,
        },
      })
    }
    else {
      await $fetch('/api/asesoramientos', {
        method: 'POST',
        body: {
          title: data.value.title,
          desc: data.value.desc,
          content: data.value.content,
        },
      })
    }

    refresh()
    data.value = {
      title: '',
      desc: '',
      content: '',
    }
    adding.value = false
    addmenu.value = false
  }
}

async function del(id: string) {
  deleting.value = true
  await $fetch(`/api/asesoramientos/${id}`, {
    method: 'DELETE',
  })
  refresh()
  deleting.value = false
}
</script>

<template>
  <div>
    <div class="max-w-1200px mx-auto px-6 pt-6">
      <h2 class="text-xl font-medium underline underline-verde-1">
        Asesoramiento
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
      <div v-else-if="!pending && !deleting && asesoramientos?.length === 0" class="text-center pt-5">
        No hay creaciones disponibles
      </div>
      <div v-else class="pt-5 grid md:grid-cols-3 gap-3 sm:grid-cols-2 grid-cols-1 mb-5">
        <div v-for="asesoramiento in asesoramientos" :key="asesoramiento.id" class="relative grid gap-2 bg-gris-900/30 rounded-lg p-4 ">
          <p>{{ asesoramiento.title }}</p>
          <p>{{ asesoramiento.desc }}</p>
          <div v-html="asesoramiento.content" />
          <div class="place-self-center p-2 bg-gris-900 rounded-lg z-2 px-3">
            <button class="text-gray-300 pr-2 border-r-2 text-sm border-gris-700" @click="editing(creacion)">
              Editar
            </button>
            <button class="text-red-500 hover:text-red-700 text-sm pl-2" @click="del(asesoramiento.id)">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

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
      <label class="text-sm font-medium">Descripción</label>
      <Input v-model="data.desc" :disabled="pending || adding" />
      <div v-if="errors.desc" class="text-red text-sm font-medium flex gap-1 items-center">
        <UnoIcon class="i-ph-warning h-4 w-4" />{{ errors.desc }} .
      </div>
    </div>
    <div class="grid gap-1">
      <label class="text-sm font-medium">Contenido</label>
      <TipTap v-model:modelValue="data.content" image />
      <div v-if="errors.content" class="text-red text-sm font-medium flex gap-1 items-center">
        <UnoIcon class="i-ph-warning h-4 w-4" />{{ errors.content }} .
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
