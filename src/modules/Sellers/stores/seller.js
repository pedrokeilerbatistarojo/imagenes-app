import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import {Seller} from "src/modules/Sellers/models/Seller.js";
import SellerService from "src/modules/Sellers/services/SellerService.js";
import configImages from "src/modules/Images/config/configImages.js";

export const useSellerStore = defineStore('seller', {
  state: () => ({
    loading: false,
    sellers: [],
    seller: null,
    winner: null,
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
            avatar: SellerService.getAvatarUrl(),
          }));
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },
    updateScore(sellerId, points) {
      const seller = this.sellers.find(s => s.id === sellerId);
      if (seller) {
        seller.score += points;

        seller.isWinner = seller.score >= configImages.winnerPoints;
        if (seller.isWinner) {
          this.winner = seller;
        }
      } else {
        console.error(`Seller con id ${sellerId} no encontrado`);
      }
    }
  }
});
