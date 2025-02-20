<template>
  <div class="q-gutter-md">
    <q-list bordered class="rounded-borders bg-white shadow-soft">
      <q-item-label header class="font-size-16 flex items-center justify-between">
        <div class="lexend">
          <span>Facturas</span>
        </div>
        <div class="lexend">
          <span>Acciones</span>
        </div>
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
          v-for="invoice in invoices"
          :key="invoice.id">
          <q-item>
            <q-item-section avatar>
              <q-icon name="description" color="black" size="34px" />
            </q-item-section>

            <q-item-section class="col-2 gt-sm">
              <q-item-label class="q-mt-sm">{{invoice.datetime}}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">
                <span class="text-weight-medium">{{invoice.seller.name}}</span>
                <span class="text-grey-8"> - {{invoice.seller.observations}}</span>
              </q-item-label>
              <q-item-label caption lines="1">
                Puntos obtenidos: <BadgeComponent :textValue="invoice.seller.score" />
                | <span class="text-primary font-size-12 fw-bold">Activo</span>
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <div class="text-grey-8 q-gutter-xs flex items-center">
                <q-btn @click="handleDelete(invoice.id)" class="gt-xs" size="12px" flat dense round icon="delete" />
                <q-btn class="gt-xs" size="12px" flat dense round icon="done" />
                <q-btn size="12px" flat dense round icon="more_vert" />
              </div>
            </q-item-section>
          </q-item>

          <q-separator spaced />
        </div>
      </div>
    </q-list>
  </div>
</template>

<script setup>
import {computed, onMounted} from "vue";
import {storeToRefs} from "pinia";
import SpinnerLoading from "src/modules/shared/components/SpinnerLoading.vue";
import {useErrorNotification} from "src/modules/shared/services/errorNotificaction.js";
import {useInvoiceStore} from "src/modules/Invoices/stores/invoice.js";
import BannerComponent from "src/modules/shared/components/BannerComponent.vue";
import invoiceService from "src/modules/Invoices/services/InvoiceService.js";
import {useSuccessNotification} from "src/modules/shared/services/successNotification.js";
import {useQuasar} from "quasar";
import BadgeComponent from "src/modules/shared/components/BadgeComponent.vue";
import SearchSellerService from "src/modules/Sellers/services/SearchSellerService.js";
import SearchInvoiceService from "src/modules/Invoices/services/SearchInvoiceService.js";

const { invoices, error, loading } = storeToRefs(useInvoiceStore());

const errorNotification = useErrorNotification();
const successNotification = useSuccessNotification();

const $q = useQuasar();

onMounted(() => {
  if(isEmptyInvoices.value){
    if(SearchSellerService.countSellers() === 0){
      loading.value = true;
      SearchSellerService.fetchSellers().then(() => handleFetchInvoices());
    }else{
      handleFetchInvoices();
    }
  }
});

const handleFetchInvoices = async () => {
  await SearchInvoiceService.fetchInvoices().then(() => {
    if (error.value) {
      errorNotification.notifyError(error.value);
    }
  });
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

const isEmptyInvoices = computed(() => invoices.value.length === 0);

</script>

<style scoped>

</style>
