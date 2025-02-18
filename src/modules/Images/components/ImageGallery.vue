<template>
  <div class="row">
    <div class="col-12">
      <TextInput
        v-model="query"
        label="Buscar imágenes"
        outlined
        class="q-mb-md"
        @keyup.enter="fetchImages"
      />
      <spinner v-if="loading" />
      <div v-else class="image-grid">
        <q-card v-for="photo in photos" :key="photo.id" class="q-ma-sm" flat bordered>
          <q-img :src="photo.urls.small" :alt="photo.alt_description" fit="cover" style="height: 200px" />
        </q-card>
      </div>
      <div class="flex flex-center">
         <span>
           <q-icon name="sentiment_very_dissatisfied" /> No hay imágenes para mostrar
         </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {serviceContainer} from "src/modules/Images/services/ServiceContainer.js";
import TextInput from "components/TextInput.vue";
import {storeToRefs} from "pinia";
import {useGalleryStore} from "src/modules/Images/stores/gallery.js";
import Skeleton from "components/Spinner.vue";
import Spinner from "components/Spinner.vue";

const { loading, error } = storeToRefs(useGalleryStore());

const query = ref('');
const photos = ref([]);
const perPage = 20;
const page = 1;


const fetchImages = async () => {
  try {
    loading.value = true;
    photos.value = await serviceContainer.searchService.searchImages(query.value, page, perPage);
  } catch (error) {
    console.error('Error al cargar las imágenes:', error);
  }
};
</script>

<style scoped>
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}
</style>
