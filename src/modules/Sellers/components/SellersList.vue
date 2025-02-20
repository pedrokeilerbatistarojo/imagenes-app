<template>
  <div class="row q-col-gutter-md">
    <div class="col">
      <TextInput
        :bottom-slots="false"
        :counter="false"
        bg-color="white"
        v-model="query"
        label="Buscar vendedores"
        outlined
        @update:modelValue="handleSearchSeller"
      />
    </div>
    <div class="col-12 col-sm-4 col-md-3 col-lg-2">
      <GenericButton
        class="float-right full-width sm:inline"
        label="Generar Factura"
        :disable="!existWinner"
        :loading="loadingInvoice"
        @click="handleGenerateInvoice"
      />
    </div>
  </div>
  <q-list bordered class="rounded-borders bg-white shadow-soft q-mt-md">
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

    <BannerComponent
      v-if="isEmptySellers && !loading"
      color="accent"
      textValue="No hay vendedores para mostrar"
      @refresh="handleFetchSellers"
    />

    <div v-if="!loading">
      <div
        v-for="seller in sellersSort"
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
          <q-tooltip>Ver detalles de {{seller.name}}</q-tooltip>
        </q-item>

        <q-separator inset="item" />
      </div>
    </div>
  </q-list>

  <SellerDialog
    v-model="showSellerDialog"
    :seller="sellerSelected"
    @cancel="handleCancelDialog"
  />
</template>

<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {storeToRefs} from "pinia";
import {useSellerStore} from "src/modules/Sellers/stores/seller.js";
import SpinnerLoading from "src/modules/shared/components/SpinnerLoading.vue";
import {useErrorNotification} from "src/modules/shared/services/errorNotificaction.js";
import BadgeComponent from "src/modules/shared/components/BadgeComponent.vue";
import SellerService from "src/modules/Sellers/services/SellerService.js";
import GenericButton from "src/modules/shared/components/GenericButton.vue";
import SellerDialog from "src/modules/Sellers/components/SellerDialog.vue";
import BannerComponent from "src/modules/shared/components/BannerComponent.vue";
import SearchSellerService from "src/modules/Sellers/services/SearchSellerService.js";
import InvoiceService from "src/modules/Invoices/services/InvoiceService.js";
import {useSuccessNotification} from "src/modules/shared/services/successNotification.js";
import TextInput from "src/modules/shared/components/TextInput.vue";

const { winner, error, loading } = storeToRefs(useSellerStore());

const errorNotification = useErrorNotification();
const successNotification = useSuccessNotification();
const showSellerDialog = ref(false);
const sellerSelected = ref(null);
const sellersSort = computed(() => SellerService.sortSellersByScore(sellerList.value));
const query = ref('');
const sellerList = ref([]);
const loadingInvoice = ref(false);

onMounted(() => {
  sellerList.value = SearchSellerService.getStoreSellers();

  if(isEmptySellers.value){
    handleFetchSellers();
  }
});

const handleFetchSellers = () => {
  SearchSellerService.fetchSellers().then(() => {
    if (error.value) {
      errorNotification.notifyError(error.value);
    }else{
      sellerList.value = SearchSellerService.getStoreSellers();
    }
  });
};

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

const handleGenerateInvoice = () => {
  loadingInvoice.value = true;
  if(existWinner.value){
    InvoiceService.createInvoice().then(() => {
      if (error.value) {
        errorNotification.notifyError(error.value);
      }else{
        successNotification.notifySuccess("Factura generada correctamente");
      }
    }).finally(() => {
      loadingInvoice.value = false;
    });
  }
};

const handleSearchSeller = () => {
  sellerList.value = SearchSellerService.getSellerByName(query.value);
};

watch(query, (newVal) => {
  if (newVal.length === 0 || newVal === '') {
    sellerList.value = SearchSellerService.getStoreSellers();
  }
});

const isEmptySellers = computed(() => sellerList.value.length === 0);

const existWinner = computed(() => winner.value !== null);

</script>

<style scoped>

</style>
