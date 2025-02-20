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
      <EmptyImageBanner v-show="empty" />
    </div>
  </div>
</template>

<script setup>
import {computed, ref, watch} from 'vue';
import {serviceContainer} from "src/modules/Images/services/ServiceContainer.js";
import TextInput from "src/modules/shared/components/TextInput.vue";
import {storeToRefs} from "pinia";
import {useGalleryStore} from "src/modules/Images/stores/gallery.js";
import SpinnerLoading from "src/modules/shared/components/SpinnerLoading.vue";
import InputValidationService from "src/modules/Images/services/InputValidationService.js";
import {useSuccessNotification} from "src/modules/shared/services/successNotification.js";
import configImages from "src/modules/Images/config/configImages.js";
import {useErrorNotification} from "src/modules/shared/services/errorNotificaction.js";
import SearchSellerService from "src/modules/Sellers/services/SearchSellerService.js";
import SellerService from "src/modules/Sellers/services/SellerService.js";
import EmptyImageBanner from "src/modules/Images/components/EmptyImageBanner.vue";

const { loading, images } = storeToRefs(useGalleryStore());

const query = ref('');
const { perPage, page } = configImages;

const successNotification = useSuccessNotification();
const errorNotification = useErrorNotification();
const empty = computed(() => images.value.length === 0 && !loading.value);

const handleSearchImages = async() => {
  try {
    await serviceContainer.searchService.searchImages(query.value, page, perPage);
  } catch (error) {
    errorNotification.notifyError(error);
  }
};

const fetchImagesData = async () => {
  if (InputValidationService.isEmptyOrWhitespace(query.value)) {
    return;
  }

  if(SearchSellerService.countSellers() === 0){
    loading.value = true;
    SearchSellerService.fetchSellers().then(() => handleSearchImages());
  }else{
    await handleSearchImages();
  }
};

const lengthDescription = configImages.descriptionLength;
const sliceStr = (textDescription) => textDescription.slice(0, lengthDescription);

const handleSelectPicture = (id) => {
  const index = images.value.findIndex((image) => image.id === id);
  images.value[index].selected = !images.value[index].selected;
  const sellerSelected =  SearchSellerService.getSellerByImageId(id);

  if (images.value[index].selected) {
    SellerService.setScore(sellerSelected.id, configImages.pointsPerImage);
  }else{
    SellerService.setScore(sellerSelected.id, -configImages.pointsPerImage);
  }

  if  (sellerSelected.isWinner) {
    successNotification.notifySuccess(`El vendedor ${sellerSelected.name} ha alcanzado ${sellerSelected.score} puntos`);
  }
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
