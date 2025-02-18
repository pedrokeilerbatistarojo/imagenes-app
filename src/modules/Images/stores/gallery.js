import { defineStore, storeToRefs } from 'pinia';

export const useGalleryStore = defineStore('gallery', {
  state: () => ({
    loading: false,
    error: null,
  }),
  actions: {
  }
});
