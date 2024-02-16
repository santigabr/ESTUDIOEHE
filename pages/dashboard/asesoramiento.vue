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

async function add(){
  console.log(data.value)
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
      <TipTap v-model="data.content"/>
    </div>
    <span v-if="pending || adding">
      <UnoIcon class="i-eos-icons-loading w-8 h-8" />
    </span>
    <Button v-else :disabled="pending || adding" start rlg @click="add">
      Agregar
    </Button>
  </Modal>
</template>
