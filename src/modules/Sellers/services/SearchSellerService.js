import {useSellerStore} from "src/modules/Sellers/stores/seller.js";
import localStorageService from "src/modules/shared/services/LocalStorageService.js";

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
    const sellers = localStorageService.getItem('sellers');
    const sellerStore = useSellerStore();

    if(sellers) {
      sellerStore.sellers = sellers;
      return sellerStore.sellers;
    }

    return await sellerStore.fetchSellers(params);
  },
  getStoreSellers(){
    const sellerStore = useSellerStore();
    return sellerStore.sellers;
  },
  countSellers() {
    const sellerStore = useSellerStore();
    return sellerStore.sellers.length;
  },
  getWinnerSeller(){
    const sellerStore = useSellerStore();
    const winner = sellerStore.sellers.find(sellerItem => sellerItem.isWinner === true);
    return winner || null;
  }
};
