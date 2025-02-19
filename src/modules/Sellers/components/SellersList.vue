<template>
  <div class="q-pa-md q-gutter-md">
    <div class="flex justify-end q-mt-none">
      <GenericButton
        label="Generar Factura"
        :loading="loading"
        :disable="!existWinner"
      />
    </div>
    <q-list bordered class="rounded-borders bg-white shadow-soft">
      <q-item-label header class="font-size-16 flex items-center justify-between">
        <div class="lexend">
          <span>Vendedores</span>
        </div>
        <div>
          <span class="block lexend">
            Puntuación
          </span>
          <div class="font-size-10 text-red block">
            <span class="text-primary">Puntos</span> | <span class="text-red">Faltantes</span>
          </div>
        </div>
      </q-item-label>
      <q-separator />

      <div v-if="loading" class="flex flex-center items-center q-pa-lg">
        <SpinnerLoading  />
      </div>

      <div
        v-for="seller in sellers"
        :key="seller.id">
        <q-item
          clickable
          v-ripple
          @click="handleShow(seller)"
          :class="{'bg-secondary': seller.isWinner}"
        >
          <q-item-section avatar>
            <q-avatar>
              <img :src=seller.avatar alt="avatar">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1" class="lexend">{{seller.name}}</q-item-label>
            <q-item-label caption lines="2">
              <BadgeComponent class="q-mx-sm" :textValue="seller.status" />
              {{seller.observations}}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <div class="q-my-sm">
              <q-btn v-if="seller.isWinner" icon="emoji_events" color="primary" flat class="q-mr-sm">
                <q-tooltip>Es el ganador</q-tooltip>
              </q-btn>
              <BadgeComponent class="q-mx-sm" :textValue="seller.score" />
              <BadgeComponent class="q-mx-sm" color="red" :textValue="missingPoint(seller.score)" />
            </div>
          </q-item-section>
        </q-item>

        <q-separator inset="item" />
      </div>
    </q-list>
  </div>

  <SellerDialog
    v-model="showSellerDialog"
    :seller="sellerSelected"
    @cancel="handleCancelDialog"
  />
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import {storeToRefs} from "pinia";
import {useSellerStore} from "src/modules/Sellers/stores/seller.js";
import SpinnerLoading from "src/modules/shared/components/SpinnerLoading.vue";
import {useErrorNotification} from "src/modules/shared/services/errorNotificaction.js";
import BadgeComponent from "src/modules/shared/components/BadgeComponent.vue";
import SellerService from "src/modules/Sellers/services/SellerService.js";
import GenericButton from "src/modules/shared/components/GenericButton.vue";
import SellerDialog from "src/modules/Sellers/components/SellerDialog.vue";

const { sellers, winner, error, loading } = storeToRefs(useSellerStore());
const { fetchSellers } = useSellerStore();

const errorNotification = useErrorNotification();
const showSellerDialog = ref(false);
const sellerSelected = ref(null);

onMounted(() => {
  if(isEmptySellers.value){
    fetchSellers().then(() => {
      if (error.value) {
        errorNotification.notifyError(error.value);
      }
    });
  }

});

const missingPoint = (score) => {
  return SellerService.getMissingScore(score);
};

const handleShow = (seller) => {
  sellerSelected.value = seller;
  showSellerDialog.value = true;
};

const handleCancelDialog = () => {
  sellerSelected.value = null;
  showSellerDialog.value = false;
}

const isEmptySellers = computed(() => sellers.value.length === 0);

const existWinner = computed(() => winner.value !== null);

</script>

<style scoped>

</style>
