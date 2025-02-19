import {useSellerStore} from "src/modules/Sellers/stores/seller.js";
import {Image} from "src/modules/Images/models/Image.js";
import configImages from "src/modules/Images/config/configImages.js";

export default {
  assignImagesToSellers(images) {
    let result = images;
    const sellerStore = useSellerStore();
    const sellerCount = sellerStore.sellers.length;
    const totalImages = images.length;
    const remainder = totalImages % sellerCount;

    let imagesNeeded = 0;
    if (remainder !== 0) {
      imagesNeeded = sellerCount - remainder;
      result = [...result, ...result.slice(0, imagesNeeded)];
    }

    const imagesPerSeller = result.length / sellerCount;

    const imagesWithSeller = [];

    sellerStore.sellers.forEach((seller, index) => {
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

    for (let i = imagesWithSeller.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [imagesWithSeller[i], imagesWithSeller[j]] = [imagesWithSeller[j], imagesWithSeller[i]];
    }

    return imagesWithSeller;
  },
  getAvatarUrl()  {
    const randomId = Math.floor(Math.random() * 6) + 1;
    return `https://cdn.quasar.dev/img/avatar${randomId}.jpg`;
  },
  setScore(sellerId, points){
    const sellerStore = useSellerStore();
    sellerStore.updateScore(sellerId, points);
  },
  getMissingScore(score){
    if (score >= configImages.winnerPoints) return 0;
    return configImages.winnerPoints - score;
  }
};
