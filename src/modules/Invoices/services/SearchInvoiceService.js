import {useInvoiceStore} from "src/modules/Invoices/infrastructure/stores/invoice.js";

export default{
  getStoreInvoices(){
    const invoiceStore = useInvoiceStore();
    return invoiceStore.invoices;
  },
  getStoreInvoiceById(invoiceId){
    const invoiceStore = useInvoiceStore();
    return invoiceStore.invoices.find(invoice => invoice.id === invoiceId);
  },
  async fetchInvoices(){
    const invoiceStore = useInvoiceStore();
    return await invoiceStore.fetchInvoices({
      order_direction: 'ASC'
    });
  },
}
