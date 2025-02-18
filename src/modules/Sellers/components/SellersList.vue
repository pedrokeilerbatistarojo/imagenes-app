<template>
  <div class="q-pa-md q-gutter-md">
    <q-list bordered class="rounded-borders bg-white shadow-soft">
      <div v-if="loading" class="flex flex-center items-center q-pa-lg">
        <SpinnerLoading  />
      </div>
      <q-item-label header>Vendedores</q-item-label>
      <div
        v-for="seller in sellers"
        :key="seller.id">
        <q-item
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-avatar>
              <img :src=avatarUrl() alt="avatar">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">{{seller.name}}</q-item-label>
            <q-item-label caption lines="2">
              <span class="text-weight-bold">{{seller.status}}</span>
              | {{seller.observations}}
            </q-item-label>
          </q-item-section>

          <q-item-section side top>

          </q-item-section>
        </q-item>

        <q-separator inset="item" />
      </div>
    </q-list>
  </div>
</template>

<script setup>
import SellerService from "src/modules/Sellers/services/SellerService.js";
import { onMounted} from "vue";
import {storeToRefs} from "pinia";
import {useSellerStore} from "src/modules/Sellers/stores/seller.js";
import SpinnerLoading from "components/SpinnerLoading.vue";

const { sellers, error, loading } = storeToRefs(useSellerStore());
const { fetchSellers } = useSellerStore();

onMounted(() => {
  fetchSellers().then(() => {
    if (error.value) {
      console.error(error.value);
    }
  });
});

const randomId = () => {
  return SellerService.getRandomId();
}

const avatarUrl = () => {
  return `https://cdn.quasar.dev/img/avatar${randomId()}.jpg`;
};

</script>

<style scoped>

</style>
