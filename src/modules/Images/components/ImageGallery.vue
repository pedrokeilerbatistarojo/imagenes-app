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
              <q-btn
                flat
                round
                :color="image.selected ? `primary` : `red`"
                :icon="image.selected ? `thumb_up` :`favorite`"
                @click="handleSelectPicture(image.id)"
              />
            </q-card-actions>
          </q-item>

          <q-img :src="image.urls.small" :alt="image.alt_description" fit="cover" style="height: 200px" />
        </q-card>
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
import {computed, ref, watch} from 'vue';
import {serviceContainer} from "src/modules/Images/services/ServiceContainer.js";
import TextInput from "components/TextInput.vue";
import {storeToRefs} from "pinia";
import {useGalleryStore} from "src/modules/Images/stores/gallery.js";
import SpinnerLoading from "components/SpinnerLoading.vue";
import InputValidationService from "src/modules/Images/services/InputValidationService.js";
import { useQuasar } from 'quasar';

const { loading, images } = storeToRefs(useGalleryStore());
const $q = useQuasar();
const query = ref('');
const perPage = 20;
const page = 1;

const empty = computed(() => images.value.length === 0 && query.value !== '');

const fetchImagesData = async () => {
  if (InputValidationService.isEmptyOrWhitespace(query.value)) {
    return;
  }

  try {
    await serviceContainer.searchService.searchImages(query.value, page, perPage);
  } catch (error) {
    console.error('Error al cargar las imágenes:', error);
  }
};

const lengthStr = 20;
const sliceStr = (textDescription) => textDescription.slice(0, lengthStr);

const handleSelectPicture = (id) => {
  const index = images.value.findIndex((image) => image.id === id);
  images.value[index].selected = !images.value[index].selected;

  $q.notify({
    color: 'green-4',
    textColor: 'white',
    position: 'top',
    icon: 'cloud_done',
    message: 'Imagen seleccionada correctamente',
  });

};

watch(query, (newVal) => {
  if (newVal.length === 0) {
    images.value = [];
  }
});

</script>

<style scoped>
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}
</style>
