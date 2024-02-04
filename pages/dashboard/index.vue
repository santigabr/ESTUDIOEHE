<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth-logged-in'],
})
</script>

<template>
  <div class="grid gap-2 max-w-1200px mx-auto px-6 pt-20">
    {{ $auth.user?.email }}
    <NuxtLink to="/api/logout" external class="bg-red place-self-start px-2 py-1 rounded-sm">
      Cerrar Sesión
    </NuxtLink>
  </div>
</template>
