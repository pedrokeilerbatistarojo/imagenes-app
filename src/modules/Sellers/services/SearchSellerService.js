import {useSellerStore} from "src/modules/Sellers/stores/seller.js";

export default {
  getSellerByImageId(imageId)  {
    const sellerStore = useSellerStore();
    return sellerStore.sellers.find(
      (seller) => seller.images.some((image) => image.id === imageId)
    );
  },
  getSellerByName(sellerName)  {
    const sellerStore = useSellerStore();
    const term = sellerName.toLowerCase();
    return sellerStore.sellers.filter(seller => seller.name.toLowerCase().includes(term));
  },
  async fetchSellers(params = {}){
    const sellerStore = useSellerStore();
    return await sellerStore.fetchSellers(params);
  },
  getStoreSellers(){
    const sellerStore = useSellerStore();
    return sellerStore.sellers;
  },
  countSellers() {
    const sellerStore = useSellerStore();
    return sellerStore.sellers.length;
  }
};
