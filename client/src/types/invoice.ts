// Типы для накладных
export interface InvoiceHeader {
  uid: string;
  typeUid: string;
  docNum: string;
  docDate: string;
  ndsSum: number;
  sumNoNds: number;
  sumSNds: number;
  clientUid: string;
  clientName: string;
  status: string;
  comment: string;
  statusBuh: string;
  filial: string;
  createTime: string;
  updateTime: string;
  isDel: boolean;
}

export interface InvoiceLine {
  uid: string;
  uidLine: string;
  goodUid: string;
  goodName: string;
  isMarked: boolean;
  seriesUid: string;
  seriesName: string;
  dateExpBefore: string;
  dateProduction: string;
  price: number;
  qnt: number;
  nds: number;
  ndsSum: number;
  sumNoNds: number;
  sumSNds: number;
  gtin: string;
  ean: string;
  dateSaleProducer: string;
  priceReestr: number;
  priceProducer: number;
}
