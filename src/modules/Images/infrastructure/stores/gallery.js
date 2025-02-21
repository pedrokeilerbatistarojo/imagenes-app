import { defineStore } from 'pinia';

export const useGalleryStore = defineStore('gallery', {
  state: () => ({
    loading: false,
    images: [],
    error: null,
  }),
  actions: {
    clearImages(){
      this.images = [];
    }
  }
});
