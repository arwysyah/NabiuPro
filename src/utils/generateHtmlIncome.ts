import dayjs from 'dayjs';
import {formatCurrency} from '../lib/currency_formatter';

export const generateDailyIncomeHtml = ({
  date,
  list,
  locale,
  currencyCode,
  totalCapital,
  totalPaid,
  totalProfit,
  t,
}: {
  date: string;
  list: {
    purchase_date: string;
    name: string;
    stock: number;
    purchase_price: number;
    selling_price: number;
    totalPaid: number;
  }[];
  locale: string;
  currencyCode: string;
  totalCapital: number;
  totalPaid: number;
  totalProfit: number;
  t: (id: string) => string;
}) => {
  const rows = list
    .map(item => {
      const capital = item.purchase_price * item.stock;
      const profit = item.totalPaid - capital;

      return `
        <tr>
       <td><span class="truncate">${item.name}</span></td>

          <td>${item.stock}</td>
          <td>${formatCurrency(item.purchase_price, locale, currencyCode)}</td>
          <td>${formatCurrency(item.selling_price, locale, currencyCode)}</td>
          <td>${formatCurrency(item.totalPaid, locale, currencyCode)}</td>
          <td>${formatCurrency(profit, locale, currencyCode)}</td>
        </tr>
      `;
    })
    .join('');

  return `
<!DOCTYPE html>
<html lang="${locale.startsWith('id') ? 'id' : 'en'}">
<head>
  <meta charset="UTF-8" />
  <title>${t('receipt.summaryTitle')}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f7f7f7;
      padding: 40px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      width: 100px;
      height: auto;
    }
      .truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px; /* adjust width as needed */
  display: inline-block;
}
    .receipt {
      background: #fff;
      padding: 30px;
      border-radius: 10px;
      max-width: 900px;
      margin: auto;
      box-shadow: 0 0 20px rgba(0,0,0,0.05);
    }
    h1 {
      color: #2563eb;
    }
    .summary {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      gap: 20px;
    }
    .card {
      flex: 1;
      padding: 20px;
      border-radius: 10px;
      color: #fff;
      text-align: center;
    }
    .capital { background: #FF9F43; }
    .income { background: #42A5F5; }
    .profit { background: #28c76f; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 30px;
    }
    th {
      background: #2563eb;
      color: #fff;
      padding: 10px;
      text-align: left;
    }
    td {
      padding: 10px;
      border-bottom: 1px solid #eee;
    }
    .total {
      text-align: right;
      font-size: 16px;
      font-weight: bold;
      margin-top: 20px;
    }
    .footer {
      margin-top: 50px;
      text-align: center;
      font-size: 14px;
      color: #999;
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <h1>${t('receipt.summaryTitle')}</h1>
      <img src="https://firebasestorage.googleapis.com/v0/b/kion-80d7f.appspot.com/o/Vector-2.png?alt=media&token=66e96a95-6c66-44e5-8bf8-f32594aac132" alt="Logo" class="logo" />
    </div>

    <p><strong>${t('receipt.date')}:</strong> ${date}</p>

    <h2 style="margin-top: 40px;">${t('receipt.incomeDetails')}</h2>
    <table>
      <thead>
        <tr>

          <th>${t('receipt.name')}</th>
          <th>${t('receipt.stock')}</th>
          <th>${t('receipt.purchasePrice')}</th>
          <th>${t('receipt.sellingPrice')}</th>
          <th>${t('receipt.totalPaid')}</th>
          <th>${t('receipt.totalProfit')}</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <div class="total">${t('receipt.netProfit')} : ${formatCurrency(
    totalProfit,
    locale,
    currencyCode,
  )}</div>

    <div class="footer">${t('receipt.issuedBy')}</div>
  </div>
</body>
</html>
`;
};
