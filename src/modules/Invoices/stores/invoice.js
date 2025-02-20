import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import SellerService from "src/modules/Sellers/services/SellerService.js";

export const useInvoiceStore = defineStore('invoice', {
  state: () => ({
    loading: false,
    invoices: [],
    invoice: null,
    error: null,
  }),
  actions: {
    async fetchInvoices(params = {}) {
      this.invoices = [];
      this.loading = true;
      this.error = null;

      await api
        .get('/invoices', {params})
        .then((response) => {
          this.invoices = response.data.map(invoiceData => ({
            ...invoiceData,
            seller: SellerService.getSellerById(invoiceData.seller.id),
          }));

          console.log(this.invoices);
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },
    async storeInvoice(data) {
      this.loading = true;
      this.invoice = null;
      this.error = null;

      await api
        .post(`/invoices`, data)
        .then((response) => {
          this.user = response.data.payload;
        })
        .catch((error) => {
          this.error = error;
          console.log(this.error)
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async deleteInvoice(id) {
      this.loading = true;
      this.error = null;

      await api
        .delete(`/invoices/${id}`)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          this.error = error;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  }
});
