// Тестовый файл для проверки функциональности экспорта в Excel
import { InvoiceHeader, InvoiceLine } from '../types/invoice';

// Тестовые данные для проверки
export const testInvoice: InvoiceHeader = {
  uid: 'test-uid-123',
  typeUid: 'test-type',
  docNum: 'Тест-001',
  docDate: '2024-12-18',
  ndsSum: 1800,
  sumNoNds: 10000,
  sumSNds: 11800,
  clientUid: 'client-123',
  clientName: 'Тестовая аптека',
  deliveryAddress: 'г. Москва, ул. Тестовая, д. 123',
  status: 'Проведен',
  comment: 'Тестовый комментарий',
  statusBuh: 'Проведен',
  filial: 'Москва',
  createTime: '2024-12-18T10:00:00',
  updateTime: '2024-12-18T10:00:00',
  isDel: false
};

export const testInvoiceLines: InvoiceLine[] = [
  {
    uid: 'line-uid-1',
    uidLine: 'line-1',
    goodUid: 'good-1',
    goodName: 'Аспирин 500мг таб №20',
    isMarked: true,
    seriesUid: 'series-1',
    seriesName: 'ABC12345',
    dateExpBefore: '2025-12-31',
    dateProduction: '2024-01-15',
    price: 150.50,
    qnt: 10,
    nds: 20,
    ndsSum: 251.67,
    sumNoNds: 1258.33,
    sumSNds: 1510.00,
    gtin: '01234567890123',
    ean: '1234567890123',
    dateSaleProducer: '2024-01-20',
    priceReestr: 145.00,
    priceProducer: 140.00
  },
  {
    uid: 'line-uid-2',
    uidLine: 'line-2',
    goodUid: 'good-2',
    goodName: 'Парацетамол 500мг таб №10',
    isMarked: false,
    seriesUid: 'series-2',
    seriesName: 'XYZ67890',
    dateExpBefore: '2026-06-30',
    dateProduction: '2024-02-10',
    price: 85.00,
    qnt: 5,
    nds: 20,
    ndsSum: 70.83,
    sumNoNds: 354.17,
    sumSNds: 425.00,
    gtin: '98765432109876',
    ean: '9876543210987',
    dateSaleProducer: '2024-02-15',
    priceReestr: 80.00,
    priceProducer: 75.00
  }
];
