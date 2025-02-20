<template>
  <q-dialog>
    <q-card class="my-card q-pa-md" style="width: 700px; max-width: 80vw;">
      <q-card-section>
        <q-list bordered class="rounded-borders">
          <q-item>
            <q-item-section avatar>
              <q-avatar>
                <img :src="invoice.seller.avatar" :alt="invoice.seller.name">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="lexend" lines="1">
                {{ invoice.seller.name }}
              </q-item-label>
              <q-item-label caption lines="1">
                <span>{{ invoice.seller.observations }}</span>
              </q-item-label>
              <q-item-label lines="1">
                <span class="font-size-12 q-mt-sm block"><b>Fecha:</b> {{invoice.datetime}}</span>
              </q-item-label>
              <q-item-label lines="1">
                <div class="text-weight-bold">
                  <span class="font-size-12">Puntos: </span>
                  <BadgeComponent class="q-mx-sm" :textValue="invoiceService.getScoreWinner(invoice.id)" />
                </div>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

      </q-card-section>

      <q-card-section class="q-pt-none">
        <InvoiceSellerList :sellers="getStorageSellers(invoice.id)" />
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn @click="handleCancel" flat color="primary" label="Cerrar" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import BadgeComponent from "src/modules/shared/components/BadgeComponent.vue";
import invoiceService from "src/modules/Invoices/services/InvoiceService.js";
import InvoiceSellerList from "src/modules/Invoices/components/InvoiceSellerList.vue";
import InvoiceService from "src/modules/Invoices/services/InvoiceService.js";

defineProps({
  invoice: Object,
});

const emit  = defineEmits([
  'cancel',
]);

const getStorageSellers = (invoiceId) => {
  const scores = InvoiceService.getItemStorageByInvoiceId(invoiceId);
  return scores.sellers;
};


const handleCancel = () => emit('cancel');

</script>
