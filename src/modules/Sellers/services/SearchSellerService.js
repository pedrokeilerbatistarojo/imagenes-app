import {useSellerStore} from "src/modules/Sellers/stores/seller.js";

export default {
  getSellerByImageId(imageId)  {
    const sellerStore = useSellerStore();
    return sellerStore.sellers.find(
      (seller) => seller.images.some((image) => image.id === imageId)
    );
  },
};
