import { useInvoiceStore } from "src/modules/Invoices/stores/invoice.js";
import { useSellerStore } from "src/modules/Sellers/stores/seller.js";
import { SimplifiedSeller } from "src/modules/Sellers/models/SimplifiedSeller.js";
import { Product } from "src/modules/Invoices/models/Product.js";
import ScoreService from "src/modules/Invoices/services/ScoreService.js";
import fakerDataService from "src/modules/Invoices/services/FakerDataService.js";
import FormatService from "src/modules/shared/services/FormatService.js";
import LocalStorageService from "src/modules/shared/services/LocalStorageService.js";

export default {
  /**
   * Creates a new invoice from the winning seller and participating sellers' data.
   *
   * 1. Get the winning seller from the seller store.
   * 2. Normalizes the winner and participating sellers' information.
   * 3. Calculates the total amount of points for the sellers.
   * 4. Generates the invoice data with date and associated seller.
   * 5. Adds the products to the invoice, taking into account the amount of points.
   * 6. Save the information in LocalStorage to keep a history of sellers on the invoices.
   * 7. Send the invoice to the invoice store for storage.
   * 8. Handles errors in case a problem occurs in the process.
   *
   * @throws {Error} If there is no winning seller, or if an error occurs while creating the invoice.
   * @returns {Promise} Promise that resolves when the invoice is stored correctly.
   */
  async createInvoice() {
    try{
      const invoiceStore = useInvoiceStore();
      const sellerStore = useSellerStore();
      const winner = sellerStore.winner;

      const winnerModel = SimplifiedSeller(winner);
      const sellers = sellerStore.sellers.map(seller => SimplifiedSeller(seller));
      const quantityScore = ScoreService.getTotalScores(sellers);

      const data = fakerDataService.getData();
      data.date = FormatService.formatDateNowShort();
      data.dueDate = FormatService.formatDateNowShort();
      data.datetime = FormatService.formatDateTimeNow();
      data.seller = winnerModel.id;
      data.items = [
        Product({
          "uid": "1f8825bb-440a-44ee-a583-47b75c4d0a24",
          "id": 1,
          "price": 100,
          "quantity": quantityScore,
          "description": "Ventas de imagenes",
          "discount": 0,
        })
      ]

      LocalStorageService.addToArray("scores", {
        id: winnerModel.id,
        winner: winnerModel,
        sellers: sellers,
        datetime: FormatService.formatDateTimeNow()
      });

      return await invoiceStore.storeInvoice(data);
    } catch (error) {
      console.error("Error al crear la factura:", error);
      throw error;
    }
  },
}
