
<template>
  <q-badge :color="color">{{textValue}}</q-badge>
</template>

<script setup>

defineProps({
  color: {
    type: String,
    default: 'primary'
  },
  textValue: {
    type: String,
    default: ''
  }
});

</script>

<style scoped>

</style>
