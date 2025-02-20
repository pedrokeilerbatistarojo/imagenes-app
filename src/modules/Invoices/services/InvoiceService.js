import {useInvoiceStore} from "src/modules/Invoices/stores/invoice.js";
import fakerDataService from "src/modules/Invoices/services/FakerDataService.js";
import FormatService from "src/modules/shared/services/FormatService.js";
import {useSellerStore} from "src/modules/Sellers/stores/seller.js";

export default {
  async createInvoice() {
    const invoiceStore = useInvoiceStore();
    const sellerStore = useSellerStore();
    const winner = sellerStore.winner;

    if (!winner) {
      throw new Error('No hay ganador');
    }

    const data = fakerDataService.getData();
    data.date = FormatService.formatDateNowShort();
    data.dueDate = FormatService.formatDateNowShort();
    data.datetime = FormatService.formatDateTimeNow();
    data.seller = winner.id;

    return await invoiceStore.storeInvoice(data);
  },
  async deleteInvoice(invoiceId) {
    const invoiceStore = useInvoiceStore();
    return await invoiceStore.deleteInvoice(invoiceId);
  },
};
