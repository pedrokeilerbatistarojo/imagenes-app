<template>
  <q-btn
    color="primary"
    text-color="white"
    class="btn-pb shadow-0"
    :loading="loading"
  />
</template>

<script setup>
defineProps({
  loading: Boolean,
});
</script>

<style lang="scss" scoped>
.btn-pb {
  font-family: Inter, sans-serif;
  font-weight: 500;
  background-color: #30aba9;
  border-radius: 8px;
  font-style: normal;
  text-transform: capitalize;
}
</style>
