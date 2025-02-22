<template>
  <q-dialog>
    <q-card class="my-card" style="width: 700px; max-width: 90vw;">
      <q-img height="400px" :src="image.urls.regular" fit="cover" :alt="image.alt_description" />
      <q-card-section class="q-pb-none">
        <q-btn
          fab
          :color="image.selected ? `` : `red`"
          :icon="image.selected ? `thumb_up` :`favorite`"
          @click="handleSelected(image.id)"
          class="absolute"
          :disabled="image.selected"
          style="top: 0; right: 15px; transform: translateY(-50%);"
        >
          <q-tooltip>Seleccionar imagen</q-tooltip>
        </q-btn>
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img :src=image.seller.avatar alt="avatar">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{image.seller.name}}</q-item-label>
            <q-item-label class="font-size-12" caption>{{image.alt_description}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>

      <q-separator />

      <q-card-actions class="q-pa-md" align="right">
        <q-btn
          @click="handleCancel"
          color="primary"
          label="Cerrar"
          icon="close" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>

defineProps({
  image: Object,
});

const emit  = defineEmits([
  'selected',
  'cancel',
]);

const handleSelected = (id) => emit('selected', id);
const handleCancel = () => emit('cancel');

</script>
