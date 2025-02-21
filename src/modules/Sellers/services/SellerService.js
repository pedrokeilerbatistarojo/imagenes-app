import {useSellerStore} from "src/modules/Sellers/infrastructure/stores/seller.js";
import {Image} from "src/modules/Images/domain/models/Image.js";
import configImages from "src/modules/Images/infrastructure/config/configImages.js";
import UtilService from "src/modules/shared/services/UtilService.js";

export default {
  assignImagesToSellers(images) {
    let result = images;
    const sellerStore = useSellerStore();
    let sellers = sellerStore.sellers;
    const sellerCount = sellers.length;
    const totalImages = images.length;
    const remainder = totalImages % sellerCount;

    let imagesNeeded = 0;
    if (remainder !== 0) {
      imagesNeeded = sellerCount - remainder;
      result = [...result, ...result.slice(0, imagesNeeded)];
    }

    const imagesPerSeller = result.length / sellerCount;

    let imagesWithSeller = [];

    sellers = UtilService.unsortItems(sellers);

    sellers.forEach((seller, index) => {
      const start = index * imagesPerSeller;
      const end = start + imagesPerSeller;
      seller.images = result.slice(start, end);

      seller.images.forEach((image) => {
        imagesWithSeller.push(Image({
          ...image,
          seller: seller,
        }));
      });
    });

    imagesWithSeller = UtilService.unsortItems(imagesWithSeller);

    return imagesWithSeller;
  },
  getSellerById(sellerId) {
    const sellerStore = useSellerStore();
    return sellerStore.sellers.find(s => s.id === sellerId);
  },
  getAvatarUrl(id = null)  {
    const maxId = 6;
    const avatarId = id <= maxId ? id: Math.floor(Math.random() * 6) + 1;
    return `https://cdn.quasar.dev/img/avatar${avatarId}.jpg`;
  },
  setScore(sellerId, points){
    const sellerStore = useSellerStore();
    return sellerStore.updateScore(sellerId, points);
  },
  getMissingScore(score){
    if (score >= configImages.winnerPoints) return 0;
    return configImages.winnerPoints - score;
  },
  sortSellersByScore(sellers){
    return sellers.sort((a, b) => b.score - a.score);
  }
};
