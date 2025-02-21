<template>
  <q-card flat bordered>
    <div class="q-ma-md lexend text-subtitle">
      Puntuación de los vendedores:
    </div>
    <q-separator />
    <div
      v-for="(seller) in sellers"
      :key="seller.id"
    >
      <q-item
        class="q-py-none"
        v-ripple
      >
        <q-item-section>
          <q-item-label lines="1" class="lexend">{{seller.name}}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <div class="q-my-sm">
            <BadgeComponent class="q-mx-sm" :textValue="seller.score" />
            <BadgeComponent class="q-mx-sm" color="red" :textValue="missingPoint(seller.score)" />
          </div>
        </q-item-section>
      </q-item>

      <q-separator />
    </div>
  </q-card>
</template>

<script setup>

import BadgeComponent from "src/modules/Shared/ui/components/BadgeComponent.vue";
import SellerService from "src/modules/Sellers/services/SellerService.js";

defineProps({
  sellers: Array,
  default: [],
});

const missingPoint = (score) => {
  return SellerService.getMissingScore(score);
};

</script>
