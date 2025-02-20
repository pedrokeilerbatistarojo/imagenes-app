import { useSellerStore } from "src/modules/Sellers/stores/seller.js";
import { useGalleryStore } from "src/modules/Images/stores/gallery.js";

export default {
  clearData(){
    const sellerStore = useSellerStore();
    const imageStore = useGalleryStore();
    sellerStore.clearScores();
    imageStore.clearImages();
  }
}
