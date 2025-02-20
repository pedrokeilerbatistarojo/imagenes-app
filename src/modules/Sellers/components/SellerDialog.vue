<template>
  <q-dialog>
    <q-card class="my-card q-pa-md" style="width: 700px; max-width: 80vw;">
      <q-card-section>
        <q-list bordered class="rounded-borders">
          <q-item>
            <q-item-section avatar>
              <q-avatar>
                <img :src="seller.avatar" :alt="seller.name">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="lexend" lines="1">{{ seller.name }}</q-item-label>
              <q-item-label caption lines="2">
                <span class="text-weight-bold">{{ seller.status }}</span>
                | {{ seller.observations }}
              </q-item-label>
              <q-item-label caption lines="1">
                <div class="text-weight-bold">
                  <span>Puntos: </span>
                  <BadgeComponent class="q-mx-sm" :textValue="seller.score" />
                  <BadgeComponent color="red" :textValue="missingPoint(seller.score)" />
                </div>
              </q-item-label>
            </q-item-section>

            <q-item-section side top>
              <span v-if="seller.isWinner" class="font-size-12 text-primary fw-bold">Ganador</span>
            </q-item-section>
          </q-item>
        </q-list>

      </q-card-section>

      <q-card-section>
        <div v-if="seller.images.length > 0"  class="row q-col-gutter-md">
          <q-card v-for="image in seller.images" :key="image.id" class="col-3 q-pt-sm" flat>
            <q-img :src="image.urls.small" :alt="image.alt_description" fit="cover" style="height: 100px" />
          </q-card>
        </div>
        <EmptyBanner v-else text-value="No hay imágenes para mostrar" />
      </q-card-section>

      <q-separator />

      <q-card-actions class="q-mt-sm" align="right">
        <q-btn @click="handleCancel" color="primary" label="Cerrar" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import BadgeComponent from "src/modules/shared/components/BadgeComponent.vue";
import SellerService from "src/modules/Sellers/services/SellerService.js";
import EmptyBanner from "src/modules/shared/components/EmptyBanner.vue";

defineProps({
  seller: Object,
});

const emit  = defineEmits([
  'cancel',
]);

const missingPoint = (score) => {
  return SellerService.getMissingScore(score);
};

const handleCancel = () => emit('cancel');

</script>
