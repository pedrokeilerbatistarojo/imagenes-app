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
          <span class="text-primary">Obtenidos</span> | <span class="text-red">Faltantes</span>
        </div>
      </div>
    </q-item-label>
    <q-separator />

    <div v-if="loading" class="flex flex-center items-center q-pa-lg">
      <SpinnerLoading  />
    </div>

    <q-intersection transition="scale">
      <EmptyBanner v-show="isEmptySellers && !loading" class="q-ma-lg"  text-value="No hay vendedores para mostrar" />
    </q-intersection>

    <transition-group
      tag="div"
      v-if="!loading"
    >
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
    </transition-group>
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
import {useSellerStore} from "src/modules/Sellers/infrastructure/stores/seller.js";
import SpinnerLoading from "src/modules/Shared/ui/components/SpinnerLoading.vue";
import {useErrorNotification} from "src/modules/Shared/ui/composables/errorNotificaction.js";
import BadgeComponent from "src/modules/Shared/ui/components/BadgeComponent.vue";
import SellerService from "src/modules/Sellers/services/SellerService.js";
import GenericButton from "src/modules/Shared/ui/components/GenericButton.vue";
import SellerDialog from "src/modules/Sellers/ui/components/SellerDialog.vue";
import SearchSellerService from "src/modules/Sellers/services/SearchSellerService.js";
import {useSuccessNotification} from "src/modules/Shared/ui/composables/successNotification.js";
import TextInput from "src/modules/Shared/ui/components/TextInput.vue";
import EmptyBanner from "src/modules/Shared/ui/components/EmptyBanner.vue";
import InputValidationService from "src/modules/Images/services/InputValidationService.js";
import CreatorInvoiceService from "src/modules/Invoices/services/CreatorInvoiceService.js";
import { useDataCleaner } from "src/modules/Shared/services/composables/Cleaner.js";

const { error, loading } = storeToRefs(useSellerStore());

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

/**
 * Get the sellers
 * After adding sellers to the store from the API
 * A copy is made so as not to affect the store data
 *
 * @returns {Promise<void>}
 */
const handleFetchSellers = () => {
  SearchSellerService.fetchSellers().then(() => {
    if (error.value) {
      errorNotification.notifyError(error.value);
    }else{
      sellerList.value = SearchSellerService.getStoreSellers();
    }
  });
};

/**
 * Calculate missing points
 * @param score
 * @returns {number|*}
 */
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

/**
 * Generate invoice
 * If there is a winner, the invoice is generated
 * After generating the invoice, the data is cleaned
 *
 * @returns {Promise<void>}
 */
const handleGenerateInvoice = () => {
  loadingInvoice.value = true;
  if(existWinner.value){
    CreatorInvoiceService.createInvoice().then(() => {
      if (error.value) {
        errorNotification.notifyError(error.value);
      }else{
        successNotification.notifySuccess("Factura generada correctamente");
        const cleaner = useDataCleaner();
        cleaner.clearData();
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
  if (InputValidationService.isEmptyOrWhitespace(newVal)) {
    sellerList.value = SearchSellerService.getStoreSellers();
  }
});

const isEmptySellers = computed(() => sellerList.value.length === 0);

const existWinner = computed(() => {
  return sellerList.value.some(sellerItem => sellerItem.isWinner === true);
});

</script>

<style scoped>

</style>
