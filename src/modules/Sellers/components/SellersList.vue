<template>
  <div class="q-pa-md q-gutter-md">
    <q-list bordered class="rounded-borders bg-white shadow-soft">
      <q-item-label header>Vendedores</q-item-label>

      <div v-if="loading" class="flex flex-center items-center q-pa-lg">
        <SpinnerLoading  />
      </div>

      <div
        v-for="seller in sellers"
        :key="seller.id">
        <q-item
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-avatar>
              <img :src=seller.avatar alt="avatar">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1" class="lexend">{{seller.name}}</q-item-label>
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
import {computed, onMounted} from "vue";
import {storeToRefs} from "pinia";
import {useSellerStore} from "src/modules/Sellers/stores/seller.js";
import SpinnerLoading from "components/SpinnerLoading.vue";

const { sellers, error, loading } = storeToRefs(useSellerStore());
const { fetchSellers } = useSellerStore();

onMounted(() => {
  if(isEmptySellers.value){
    fetchSellers().then(() => {
      if (error.value) {
        console.error(error.value);
      }
    });
  }

});

const isEmptySellers = computed(() => {
  return sellers.value.length === 0;
});

</script>

<style scoped>

</style>
