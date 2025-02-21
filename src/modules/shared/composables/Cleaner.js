import { useSellerStore } from "src/modules/Sellers/stores/seller.js";
import { useGalleryStore } from "src/modules/Images/stores/gallery.js";

class Cleaner {
  constructor() {
    this.sellerStore = useSellerStore();
    this.imageStore = useGalleryStore();
  }

  clearSellerData() {
    this.sellerStore.clearScores();
  }

  clearImagesData() {
    this.imageStore.clearImages();
  }

  clearData() {
    this.clearSellerData();
    this.clearImagesData();
  }
}

export function useDataCleaner() {
  return new Cleaner();
}
