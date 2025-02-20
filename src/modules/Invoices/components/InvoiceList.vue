<template>
  <div class="q-gutter-md">
    <q-list bordered class="rounded-borders bg-white shadow-soft q-mt-md">
      <q-item-label header class="font-size-16 flex items-center justify-between lexend">
        <span>Facturas</span>
        <span>Acciones </span>
      </q-item-label>
      <q-separator />

      <div v-if="loading" class="flex flex-center items-center q-pa-lg">
        <SpinnerLoading  />
      </div>

      <BannerComponent
        v-if="isEmptyInvoices && !loading"
        color="accent"
        textValue="No hay facturas para mostrar"
        @refresh="handleFetchInvoices"
      />

      <div v-if="!loading">
        <div
          v-for="invoice in invoiceList"
          :key="invoice.id"
        >
          <q-item
            v-ripple
          >
            <q-item-section avatar>
              <q-avatar>
                <img :src=invoice.seller.avatar alt="avatar">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1" class="lexend">{{invoice.seller.name}}</q-item-label>
              <q-item-label caption lines="2">
                <span class="font-size-12">{{invoice.datetime.split(" ")[0]}}</span>
                <span class="font-size-12">{{invoice.datetime.split(" ")[1]}}</span>
                <div class="q-my-sm">
                  <BadgeComponent :textValue="getScoreWinner(invoice.id)" /> Puntos
                </div>
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <div class="text-grey-8 q-gutter-xs flex items-center">

                <q-btn
                  @click="handleViewDetails(invoice.id)"
                  size="12px"
                  flat
                  dense
                  round
                  icon="visibility"
                >
                  <q-tooltip>Ver detalles de la factura: {{invoice.id}}</q-tooltip>
                </q-btn>
                <q-btn
                  @click="handleDelete(invoice.id)"
                  color="red"
                  size="12px"
                  flat
                  dense
                  round
                  icon="delete"
                >
                  <q-tooltip>Eliminar factura</q-tooltip>
                </q-btn>
              </div>
            </q-item-section>
          </q-item>

          <q-separator inset="item" />
        </div>
      </div>
    </q-list>
  </div>

  <InvoiceDialog
    v-model="showInvoiceDialog"
    :invoice="invoiceSelected"
    @cancel="handleCancelDialog"
  />
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import SpinnerLoading from "src/modules/shared/components/SpinnerLoading.vue";
import { useErrorNotification } from "src/modules/shared/services/errorNotificaction.js";
import BannerComponent from "src/modules/shared/components/BannerComponent.vue";
import invoiceService from "src/modules/Invoices/services/InvoiceService.js";
import InvoiceService from "src/modules/Invoices/services/InvoiceService.js";
import { useSuccessNotification } from "src/modules/shared/services/successNotification.js";
import { useQuasar } from "quasar";
import BadgeComponent from "src/modules/shared/components/BadgeComponent.vue";
import SearchSellerService from "src/modules/Sellers/services/SearchSellerService.js";
import SearchInvoiceService from "src/modules/Invoices/services/SearchInvoiceService.js";
import { useInvoiceStore } from "src/modules/Invoices/stores/invoice.js";
import InvoiceDialog from "src/modules/Invoices/components/InvoiceDialog.vue";

const { error, loading } = storeToRefs(useInvoiceStore());

const errorNotification = useErrorNotification();
const successNotification = useSuccessNotification();
const invoiceList = ref([]);
const invoiceSelected = ref(null);
const showInvoiceDialog = ref(false);
const $q = useQuasar();

onMounted(() => {
  invoiceList.value = SearchInvoiceService.getStoreInvoices();

  if(isEmptyInvoices.value){
    if(SearchSellerService.countSellers() === 0){
      loading.value = true;
      SearchSellerService.fetchSellers().then(() => handleFetchInvoices());
    }else{
      handleFetchInvoices();
    }
  }
});

const isEmptyInvoices = computed(() => invoiceList.value.length === 0);

const handleFetchInvoices = async () => {
  await SearchInvoiceService.fetchInvoices().then(() => {
    if (error.value) {
      errorNotification.notifyError(error.value);
    }else{
      invoiceList.value = SearchInvoiceService.getStoreInvoices();
    }
  });
};

const getScoreWinner = (invoiceId) => {
  const scores = InvoiceService.getItemStorageByInvoiceId(invoiceId);
  return `${scores ? scores.winner.score : 0}`;
};

const handleViewDetails = (id) => {
  invoiceSelected.value = SearchInvoiceService.getStoreInvoiceById(id);
  if (invoiceSelected.value){
    showInvoiceDialog.value = true;
  }else{
    errorNotification.notifyError("Ha ocurrido un error al intentar mostrar la factura");
  }
};

const handleDelete = (id) => {
  $q.dialog({
    title: 'Eliminar factura',
    message:
      '¿Está seguro que desea eliminar esta factura? La acción no podrá ser revertida.',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    invoiceService.deleteInvoice(id).then(() => {
      if(!error.value){
        successNotification.notifySuccess("Factura eliminada correctamente");
        handleFetchInvoices();
      }else{
        errorNotification.notifyError(error.value);
      }
    });
  }).onCancel(() => {});
};

const handleCancelDialog = () => {
  invoiceSelected.value = null;
  showInvoiceDialog.value = false;
}

</script>

<style scoped>

</style>
