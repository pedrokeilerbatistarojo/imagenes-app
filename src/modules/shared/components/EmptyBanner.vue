

<template>
  <div class="flex flex-center">
    <span class="bg-gray-2 font-size-14 text-subtitle lexend">
      <q-icon name="sentiment_very_dissatisfied" /> {{textValue}}
    </span>
  </div>
</template>

<script setup>
defineProps({
  textValue: String,
})
</script>
