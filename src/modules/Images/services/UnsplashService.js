import { createApi } from 'unsplash-js';
import { SearchService } from './SearchService';
import {storeToRefs} from "pinia";
import {useGalleryStore} from "src/modules/Images/stores/gallery.js";
import SellerService from "src/modules/Sellers/services/SellerService.js";
const { loading, images } = storeToRefs(useGalleryStore());

const unsplash = createApi({
  accessKey: import.meta.env.VITE_UNSPLASH_ACCESS_KEY,
});

export class UnsplashService extends SearchService {
  async searchImages(query, page = 1, perPage = 10) {
    loading.value = true;

    try {
      let response = await unsplash.search.getPhotos({ query, page, perPage });
      let result = response.response.results;

      images.value = SellerService.assignImagesToSellers(result);

    } catch (error) {
      console.error('Error fetching Unsplash images:', error);
      throw error;
    }finally {
      loading.value = false;
    }
  }
}
