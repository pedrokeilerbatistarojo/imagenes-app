import {useInvoiceStore} from "src/modules/Invoices/stores/invoice.js";

export default{
  async fetchInvoices(){
    const invoiceStore = useInvoiceStore();
    return await invoiceStore.fetchInvoices();
  },
}
