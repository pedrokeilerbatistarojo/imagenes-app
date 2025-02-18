import { createApi } from 'unsplash-js';
import { SearchService } from './SearchService';
import {storeToRefs} from "pinia";
import {useGalleryStore} from "src/modules/Images/stores/gallery.js";
const { loading, error } = storeToRefs(useGalleryStore());

const unsplash = createApi({
  accessKey: import.meta.env.VITE_UNSPLASH_ACCESS_KEY,
});

export class UnsplashService extends SearchService {
  async searchImages(query, page = 1, perPage = 10) {
    try {
      const response = await unsplash.search.getPhotos({ query, page, perPage });
      return response.response.results;
    } catch (error) {
      error.value = error;
      console.error('Error fetching Unsplash images:', error);
      throw error;
    }finally {
      loading.value = false;
    }
  }
}
