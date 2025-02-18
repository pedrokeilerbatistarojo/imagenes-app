<template>
  <div class="row">
    <div class="col-12">
      <TextInput
        bg-color="white"
        v-model="query"
        label="Buscar imágenes"
        outlined
        class="q-mb-md"
        @keyup.enter="fetchImagesData"
      />
      <SpinnerLoading v-if="loading" />
      <div v-else class="image-grid">
        <q-card v-for="image in images" :key="image.id" class="my-card" flat bordered>
          <q-item>
            <q-item-section avatar>
              <q-avatar>
                <img :src=image.seller.avatar alt="avatar">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{image.seller.name}}</q-item-label>
              <q-item-label caption>{{sliceStr(image.alt_description)}}...</q-item-label>
            </q-item-section>

            <q-card-actions align="right">
              <q-btn flat round color="red" icon="favorite" @click="handleSelectPicture(image.id)" />
            </q-card-actions>
          </q-item>

          <q-img :src="image.urls.small" :alt="image.alt_description" fit="cover" style="height: 200px" />
        </q-card>
<!--        <q-card v-for="photo in photos" :key="photo.id" class="q-ma-sm" flat bordered>-->
<!--          <q-img :src="photo.urls.small" :alt="photo.alt_description" fit="cover" style="height: 200px" />-->
<!--        </q-card>-->
      </div>
      <div v-if="empty" class="flex flex-center">
         <span>
           <q-icon name="sentiment_very_dissatisfied" /> No hay imágenes para mostrar
         </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue';
import {serviceContainer} from "src/modules/Images/services/ServiceContainer.js";
import TextInput from "components/TextInput.vue";
import {storeToRefs} from "pinia";
import {useGalleryStore} from "src/modules/Images/stores/gallery.js";
import SpinnerLoading from "components/SpinnerLoading.vue";

const { loading, images } = storeToRefs(useGalleryStore());

const query = ref('');
const perPage = 20;
const page = 1;

const empty = computed(() => images.value.length === 0 && query.value !== '');

const fetchImagesData = async () => {
  try {
    await serviceContainer.searchService.searchImages(query.value, page, perPage);
  } catch (error) {
    console.error('Error al cargar las imágenes:', error);
  }
};

const lengthStr = 20;
const sliceStr = (textDescription) => textDescription.slice(0, lengthStr);

const handleSelectPicture = (id) => {
  console.log('Seleccionar imagen:', id);
};

</script>

<style scoped>
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}
</style>
