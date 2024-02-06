<script setup lang="ts">
const { data, pending, refresh } = await useFetch('/api/sizes')
definePageMeta({
  layout: 'dashboard',
})
</script>

<template>
  <PlanosSizes :data="data" :pending="pending" :refresh="refresh" />
  <Planos :data="data" />
</template>
