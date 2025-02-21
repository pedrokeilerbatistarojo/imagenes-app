import {useInvoiceStore} from "src/modules/Invoices/infrastructure/stores/invoice.js";
import LocalStorageService from "src/modules/shared/services/LocalStorageService.js";

export default {
  /**
   * Delete the invoice by id and Delete assiciate score in the locaStorage
   * @param invoiceId
   * @returns {Promise<void>}
   */
  async deleteInvoice(invoiceId) {
    const invoiceStore = useInvoiceStore();
    let scoresHistory = LocalStorageService.getItem("scores") || [];
    const invoice = invoiceStore.invoices.find(inv => inv.id === invoiceId);

    if (invoice) {
      scoresHistory = scoresHistory.filter(scoreItem => scoreItem.datetime !== invoice.datetime);
      LocalStorageService.setItem("scores", scoresHistory);
    }

    return await invoiceStore.deleteInvoice(invoiceId);
  },
  getItemStorageByInvoiceId(invoiceId) {
    const invoiceStore = useInvoiceStore();
    const invoice = invoiceStore.invoices.find(invoice => invoice.id === invoiceId);
    if (invoice) {
      const scoresHistory = LocalStorageService.getItem("scores") || [];
      return scoresHistory.find(scoreItem => scoreItem.datetime === invoice.datetime);
    }

    return null;
  },
};
