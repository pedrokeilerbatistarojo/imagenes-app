import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import {Seller} from "src/modules/Sellers/models/Seller.js";

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

      await api
        .get('/sellers', {params})
        .then((response) => {
          this.sellers = response.data.map(sellerData => Seller(sellerData));
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },
  }
});
