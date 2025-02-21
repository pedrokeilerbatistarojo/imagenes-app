<template>
  <q-dialog>
    <q-card class="my-card q-pa-md" style="width: 600px; max-width: 95vw;">
      <q-card-section>
        <q-list bordered class="rounded-borders">
          <q-item class="">
            <q-item-section avatar>
              <q-avatar>
                <img :src=invoice.seller.avatar alt="avatar">
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label lines="1">
                <div class="flex justify-between">
                  <div>
                    <span class="fw-bold block lexend">{{ invoice.seller.name }}</span>
                    <span class="text-subtitle">{{ invoice.seller.observations }}</span>
                  </div>
                  <div>
                    <div class="flex justify-between">
                      <span class="text-subtitle"> Fecha: </span>
                      <span class="fw-bold"> {{invoice.date}}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-subtitle">Puntos totales: </span>
                      <BadgeComponent class="q-mx-sm fw-bold" :textValue="getTotalScore(invoice.id)" />
                    </div>
                  </div>
                </div>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

      </q-card-section>

      <q-card-section v-if="sellers.length > 0" class="q-pt-none">
        <InvoiceSellerList :sellers="sellers" />
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
import InvoiceSellerList from "src/modules/Invoices/components/InvoiceSellerList.vue";
import InvoiceService from "src/modules/Invoices/services/InvoiceService.js";
import ScoreService from "src/modules/Invoices/services/ScoreService.js";
import SearchInvoiceService from "src/modules/Invoices/services/SearchInvoiceService.js";
import { computed } from "vue";

const props = defineProps({
  invoice: Object,
});

const emit  = defineEmits([
  'cancel',
]);

const getStorageSellers = (invoiceId) => {
  const scores = InvoiceService.getItemStorageByInvoiceId(invoiceId);
  return scores ? scores.sellers : [];
};

const sellers = computed(() => getStorageSellers(props.invoice.id));

const getTotalScore = () => {
  const invoice = SearchInvoiceService.getStoreInvoiceById(props.invoice.id);
  return `${invoice ? ScoreService.getTotalScoreByInvoice(invoice.items) : 0}`;
};

const handleCancel = () => emit('cancel');

</script>
