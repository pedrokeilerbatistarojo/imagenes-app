
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-banner inline-actions rounded class="bg-grey-2 text-gray">
      {{textValue}}

      <template v-slot:action>
        <q-btn
          flat
          icon-right="refresh"
          @click="$emit('refresh')"
        >
          <q-tooltip>Actualizar</q-tooltip>
        </q-btn>
      </template>
    </q-banner>
  </div>
</template>

<script setup>

defineProps({
  textValue: {
    type: String,
    default: ''
  }
});

defineEmits(['refresh']);

</script>

<style scoped>

</style>
