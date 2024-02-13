<script setup lang="ts">
interface Link {
  label: string
  href: string
}

const links: Link[] = [
  {
    label: 'Servicios',
    href: '/dashboard/servicios',
  },
  {
    label: 'Creaciones',
    href: '/dashboard/creaciones',
  },
  {
    label: 'Asesoramiento',
    href: '/dashboard/asesoramiento',
  },

  {
    label: 'Planos',
    href: '/dashboard/planos',
  },
  {
    label: 'Contacto',
    href: '/dashboard/contacto',
  },
]

const menu = ref(false)
</script>

<template>
  <div class="backdrop-blur-sm sticky z-30 top-0">
    <header class="max-w-1200px mx-auto h-64px py-2 px-6 flex justify-between flex items-center">
      <NuxtLink to="/dashboard" class="text-xl font-bold">
        Dashboard
      </NuxtLink>
      <nav class="sm:block hidden">
        <ul class="gap-x-4 flex">
          <li v-for="link in links" :key="link.href">
            <NuxtLink :to="link.href" class="text-sm buttons px-2 font-medium">
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
      <div class="flex gap-3">
        <Button link to="/">
          Volver
          <UnoIcon class="i-mdi-arrow-right hover: w-4 h-4" />
        </Button>
        <button class="sm:hidden" @click="menu = !menu">
          <UnoIcon class="i-ph-list w-25px h-25px buttons" />
        </button>
      </div>
    </header>
  </div>
  <div v-if="menu === true" class="absolute sm:hidden top-0 h-full z-40 px-6 bg-gris-900/30 backdrop-blur-lg w-full">
    <div class="h-64px flex items-center justify-end">
      <button class="" @click="menu = !menu">
        <UnoIcon class="i-ph-x w-25px h-25px buttons" />
      </button>
    </div>
    <nav>
      <ul class="grid gap-3">
        <li v-for="link in links" :key="link.href">
          <NuxtLink :to="link.href" class="text-xl font-bold" @click="menu = !menu">
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>
