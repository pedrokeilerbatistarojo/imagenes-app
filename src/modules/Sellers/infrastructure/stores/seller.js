import { defineStore } from 'pinia';
// import { api } from 'boot/axios';
import {Seller} from "src/modules/Sellers/domain/models/Seller.js";
import SellerService from "src/modules/Sellers/services/SellerService.js";
import configImages from "src/modules/Images/infrastructure/config/configImages.js";
import LocalStorageService from "src/modules/Shared/services/LocalStorageService.js";
import { api } from 'src/modules/Shared/infrastructure/services/HttpClient.js';

export const useSellerStore = defineStore('seller', {
  state: () => ({
    loading: false,
    sellers: [],
    seller: null,
    error: null,
  }),
  actions: {
    async fetchSellers(params = {}) {
      this.sellers = [];
      this.loading = true;
      this.error = null;

      await api
        .get('/sellers', {params})
        .then((response) => {
          this.sellers = response.data.map(sellerData => Seller({
            ...sellerData,
            avatar: SellerService.getAvatarUrl(sellerData.id),
          }));
          LocalStorageService.setItem('sellers', this.sellers);
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },
    updateScore(sellerId, points) {

      const winner = this.sellers.some(sellerItem => sellerItem.isWinner === true);

      if(winner) {
        console.error("Ya hay un ganador");
        return false;
      }

      const seller = this.sellers.find(s => s.id === sellerId);
      if (seller) {
        seller.score += points;

        seller.isWinner = seller.score >= configImages.winnerPoints;

        LocalStorageService.setItem('sellers', this.sellers);
        return true;

      } else {
        console.error(`Seller con id ${sellerId} no encontrado`);
      }
    },
    clearScores() {
      this.sellers.forEach(seller => {
        seller.score = 0;
        seller.isWinner = false;
      });
      LocalStorageService.setItem('sellers', this.sellers);
    },
  }
});
