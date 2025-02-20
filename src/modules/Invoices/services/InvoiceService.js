import {useInvoiceStore} from "src/modules/Invoices/stores/invoice.js";
import fakerDataService from "src/modules/Invoices/services/FakerDataService.js";
import FormatService from "src/modules/shared/services/FormatService.js";
import {useSellerStore} from "src/modules/Sellers/stores/seller.js";
import LocalStorageService from "src/modules/shared/services/LocalStorageService.js";
import { SimplifiedSeller } from "src/modules/Sellers/models/SimplifiedSeller.js";

export default {
  async createInvoice() {
    const invoiceStore = useInvoiceStore();
    const sellerStore = useSellerStore();
    const winner = sellerStore.winner;

    if (!winner) {
      throw new Error('No hay ganador');
    }

    const winnerModel = SimplifiedSeller(winner);
    const sellers = sellerStore.sellers.map(seller => SimplifiedSeller(seller));

    const data = fakerDataService.getData();
    data.date = FormatService.formatDateNowShort();
    data.dueDate = FormatService.formatDateNowShort();
    data.datetime = FormatService.formatDateTimeNow();
    data.seller = winnerModel.id;

    LocalStorageService.addToArray("scores", {
      id: winnerModel.id,
      winner: winnerModel,
      sellers: sellers,
      datetime: FormatService.formatDateTimeNow()
    });

    return await invoiceStore.storeInvoice(data);
  },
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
  getScoreWinner(invoiceId) {
    const scores = this.getItemStorageByInvoiceId(invoiceId);
    return `${scores ? scores.winner.score : 0}`;
  }
};
