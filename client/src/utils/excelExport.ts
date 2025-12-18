import * as XLSX from 'xlsx';
import { InvoiceHeader, InvoiceLine } from '../types/invoice';

// Функция форматирования даты
function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

// Экспорт одной накладной в Excel
export const exportInvoiceToExcel = (invoice: InvoiceHeader, lines: InvoiceLine[]) => {
  // Создаем новую книгу
  const wb = XLSX.utils.book_new();

  // Данные для шапки (первые строки с реквизитами накладной)
  const headerData = [
    ['Реквизиты накладной'],
    ['Номер накладной', invoice.docNum || ''],
    ['Дата', formatDate(invoice.docDate)],
    ['Клиент', invoice.clientName || ''],
    ['Адрес доставки', invoice.deliveryAddress || ''],
    ['Статус', invoice.status || ''],
    ['Комментарий', invoice.comment || ''],
    ['Сумма без НДС', invoice.sumNoNds || 0],
    ['Сумма НДС', invoice.ndsSum || 0],
    ['Сумма с НДС', invoice.sumSNds || 0],
    [], // Пустая строка для разделения
    ['Табличная часть']
  ];

  // Заголовки таблицы
  const tableHeaders = [
    'Товар',
    'Маркирован',
    'Серия',
    'Срок годности',
    'Дата производства',
    'Цена с НДС',
    'Количество',
    'Ставка НДС',
    'Сумма с НДС',
    'GTIN',
    'EAN',
    'Дата реализации'
  ];

  // Данные строк
  const tableData = lines.map(line => [
    line.goodName || '',
    line.isMarked ? 'Да' : 'Нет',
    line.seriesName || '',
    formatDate(line.dateExpBefore),
    formatDate(line.dateProduction),
    line.price || 0,
    line.qnt || 0,
    `${line.nds || 0}%`,
    line.sumSNds || 0,
    line.gtin || '',
    line.ean || '',
    formatDate(line.dateSaleProducer)
  ]);

  // Объединяем шапку и таблицу
  const allData = [...headerData, tableHeaders, ...tableData];

  // Создаем worksheet
  const ws = XLSX.utils.aoa_to_sheet(allData);

  // Настраиваем ширину колонок
  const colWidths = [
    { wch: 30 }, // Товар
    { wch: 10 }, // Маркирован
    { wch: 15 }, // Серия
    { wch: 12 }, // Срок годности
    { wch: 15 }, // Дата производства
    { wch: 12 }, // Цена с НДС
    { wch: 10 }, // Количество
    { wch: 10 }, // Ставка НДС
    { wch: 12 }, // Сумма с НДС
    { wch: 15 }, // GTIN
    { wch: 15 }, // EAN
    { wch: 15 }  // Дата реализации
  ];
  ws['!cols'] = colWidths;

  // Добавляем worksheet в книгу
  XLSX.utils.book_append_sheet(wb, ws, 'Накладная');

  // Имя файла - номер накладной
  const fileName = `Накладная_${invoice.docNum || 'без_номера'}.xlsx`;

  // Сохраняем файл
  XLSX.writeFile(wb, fileName);
};

// Экспорт списка накладных в Excel
export const exportInvoicesListToExcel = (invoices: InvoiceHeader[]) => {
  // Создаем новую книгу
  const wb = XLSX.utils.book_new();

  // Заголовки таблицы
  const headers = [
    'Номер',
    'Дата',
    'Клиент',
    'Адрес доставки',
    'Сумма без НДС',
    'Сумма НДС',
    'Сумма с НДС',
    'Статус',
    'Комментарий'
  ];

  // Данные
  const data = invoices.map(invoice => [
    invoice.docNum || '',
    formatDate(invoice.docDate),
    invoice.clientName || '',
    invoice.deliveryAddress || '',
    invoice.sumNoNds || 0,
    invoice.ndsSum || 0,
    invoice.sumSNds || 0,
    invoice.status || '',
    invoice.comment || ''
  ]);

  // Объединяем заголовки и данные
  const allData = [headers, ...data];

  // Создаем worksheet
  const ws = XLSX.utils.aoa_to_sheet(allData);

  // Настраиваем ширину колонок
  const colWidths = [
    { wch: 15 }, // Номер
    { wch: 12 }, // Дата
    { wch: 25 }, // Клиент
    { wch: 30 }, // Адрес доставки
    { wch: 15 }, // Сумма без НДС
    { wch: 12 }, // Сумма НДС
    { wch: 15 }, // Сумма с НДС
    { wch: 15 }, // Статус
    { wch: 30 }  // Комментарий
  ];
  ws['!cols'] = colWidths;

  // Добавляем worksheet в книгу
  XLSX.utils.book_append_sheet(wb, ws, 'Накладные');

  // Имя файла
  const fileName = 'Накладные_список.xlsx';

  // Сохраняем файл
  XLSX.writeFile(wb, fileName);
};
