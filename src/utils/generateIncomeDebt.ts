import {formatCurrency} from '../lib/currency_formatter';

export const generateDailyActivityHtml = ({
  date,
  list,
  locale,
  currencyCode,
  t,
  totalIncome,
  totalExpense,
}: {
  date: string;
  list: {
    title: string;
    amount: number;
    note?: string;
    type: 'income' | 'expense';
    category: string;
    subcategory?: string;
  }[];
  locale: string;
  currencyCode: string;
  t: (id: string) => string;
}) => {
  const rows = list
    .map(item => {
      return `
        <tr>
       <td><span class="truncate">${t(item.title)}</span></td>
          <td>${t('home.popUp.' + item.type)}</td>
           <td>${t(item.category)}</td>
          <td>${t(item.subcategory || '')}</td>
          <td>${formatCurrency(item.amount, locale, currencyCode)}</td>
        </tr>
      `;
    })
    .join('');

  return `
<!DOCTYPE html>
<html lang="${locale.startsWith('id') ? 'id' : 'en'}">
<head>
  <meta charset="UTF-8" />
  <title>${t('receipt.activityTitle')}</title>
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
      .income-summary {
  background-color: #e6fcf1;
  color: #000;
}
.expense-summary {
  background-color: #ffecec;
  color: #000; /* override white text */
}
.amount {
  font-size: 20px;
  margin-top: 8px;
}
.income-amount {
  color: #1abc9c;
  font-weight: bold;
}
.expense-amount {
  color: red;
  font-weight: bold;
}
      .truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px; /* adjust width as needed */
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
      // color: #fff;
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
      <h1>${t('receipt.activityTitle')}</h1>
      <img src="https://firebasestorage.googleapis.com/v0/b/kion-80d7f.appspot.com/o/Vector-2.png?alt=media&token=66e96a95-6c66-44e5-8bf8-f32594aac132" alt="Logo" class="logo" />
    </div>

    <p><strong>${t('receipt.date')}:</strong> ${date}</p>

    <h2 style="margin-top: 40px;">${t('receipt.activityDetails')}</h2>
    <div class="summary">
  <div class="card income-summary">
    <div><strong>${t('total_income_today')}</strong></div>
    <div class="amount income-amount">${formatCurrency(
      totalIncome,
      locale,
      currencyCode,
    )}</div>
  </div>
  <div class="card expense-summary">
    <div><strong>${t('total_expense_today')}</strong></div>
    <div class="amount expense-amount">${formatCurrency(
      totalExpense,
      locale,
      currencyCode,
    )}</div>
  </div>
</div>
    <table>
      <thead>
        <tr>

          <th>${t('transaction.title')}</th>
          <th>${t('transaction.type')}</th>
          <th>${t('transaction.category')}</th>
          <th>${t('transaction.subCategory')}</th>
  
          <th>${t('transaction.amount')}</th>
    
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>


    <div class="footer">${t('receipt.issuedBy')}</div>
  </div>
</body>
</html>
`;
};
