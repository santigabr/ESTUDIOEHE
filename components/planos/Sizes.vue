<script setup lang="ts">
const props = defineProps<{ data: { id: string, size: string }[] | null, pending?: boolean, refresh: Function }>()

const adding = ref(false)
const deleting = ref(false)
const value = ref('')
const error = ref('')
const selected = ref<string[]>([])
const showAll = ref(false)

function select(id: string) {
  selected.value.push(id)
}

function unselect(index: number) {
  selected.value.splice(index, 1)
}

function unselectAll() {
  selected.value = []
  const checkboxes = document.querySelectorAll('input[type="checkbox"]')
  checkboxes.forEach((checkbox) => {
    if (checkbox instanceof HTMLInputElement)
      checkbox.checked = false
  })
}

async function add() {
  const sizePattern = /^\d+x\d+$/
  const isValidSize = sizePattern.test(value.value)
  const sizeExists = props.data?.some(size => size.size === value.value)

  if (!isValidSize)
    error.value = 'El tamaño debe tener el formato (numero)x(numero)'
  else if (sizeExists)
    error.value = 'El tamaño existe '
  else if (value.value === '')
    error.value = 'Coloca un size valido'

  if (value.value !== '' && isValidSize && !sizeExists) {
    adding.value = true
    await $fetch('/api/sizes', {
      method: 'POST',
      body: {
        size: value.value,
      },
    })
    error.value = ''
    unselectAll()
    props.refresh()
    adding.value = false
    value.value = ''
  }
}

async function del() {
  deleting.value = true
  error.value = ''

  await Promise.all(selected.value.map(async (id) => {
    await $fetch(`/api/sizes/${id}`, {
      method: 'DELETE',
    })
  }))

  unselectAll()
  props.refresh()
  deleting.value = false
}
</script>

<template>
  <div class="max-w-1200px mx-auto px-6 pt-6">
    <div class="grid gap-5 border-b border-gris-800 pb-5">
      <h2 class="text-xl underline underline-verde-1 font-medium">
        Tamaños
      </h2>

      <div class="grid gap-1">
        <label class="font-medium text-sm">Tamaño (Ej: 10x10)</label>
        <Input v-model="value" start :disabled="adding || pending || deleting" />
        <div v-if="error" class="text-red text-sm font-medium flex gap-1 items-center">
          <UnoIcon class="i-ph-warning h-4 w-4" />{{ error }} .
        </div>
      </div>

      <span v-if="pending || deleting || adding">
        <UnoIcon class="i-eos-icons-loading h-7 w-7" />
      </span>

      <Button v-else start @click="add">
        Agregar <UnoIcon class="i-ph-plus-bold h-4 w-4" />
      </Button>
    </div>

    <div v-if="pending || deleting || adding" class="text-center pt-5">
      Cargando...
    </div>

    <div v-else-if="!pending && !deleting && props.data?.length === 0" class="text-center pt-5">
      No hay tamaños disponibles
    </div>

    <div v-else class="pt-5">
      <button class="font-medium bg-gris-900/30 py-2 px-3 max-w-170px flex justify-between items-center w-full rounded-lg mb-3" @click="(showAll = !showAll) && unselectAll()">
        {{ showAll ? 'Ocultar todos' : 'Mostrar todos' }}
        <UnoIcon :class="[showAll ? 'i-fluent-chevron-down-20-filled' : 'i-fluent-chevron-right-20-filled']" class="h-5 w-5" />
      </button>
      <div v-if="showAll" class="grid space-y-2">
        <div v-if="selected.length > 0" class="flex justify-between h-10">
          <button class="flex items-center rounded-full" @click="unselectAll()">
            <UnoIcon class="i-ph-x-bold w-7 h-7" />
          </button>

          <Button red @click="del">
            <UnoIcon class="i-fluent-delete-24-regular" />
            Eliminar
          </Button>
        </div>

        <label v-for="size in props.data" :key="size.id" class="has-[:checked]:bg-gris-900 flex p-3 block w-full bg-gris-900/30 rounded-lg">
          <input type="checkbox" class="shrink-0 mt-0.5" @click="selected.includes(size.id) ? unselect(selected.indexOf(size.id)) : select(size.id)">
          <span class="ms-3">{{ size.size }}</span>
        </label>
      </div>
    </div>
  </div>
</template>
