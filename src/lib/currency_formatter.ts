const currencies = {
  IDR: 'Rp',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  // Add more as needed
};

export const formatCurrency = (
  value: number | string,
  locale: string,
  currencyCode: string,
  maximumFractionDigits = 0,
) => {
  const number = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(number)) {
    return `${currencies[currencyCode] || ''} 0`;
  }

  try {
    let formatted = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits,
    }).format(number);

    // Add space after currency symbol for these currencies:
    // We'll replace currency symbol with symbol + space
    if (currencyCode === 'IDR') {
      // Replace "Rp" with "Rp "
      formatted = formatted.replace(/^Rp/, 'Rp ');
    } else if (currencyCode === 'USD') {
      // Replace "$" with "$ "
      formatted = formatted.replace(/^\$/, '$ ');
    } else if (currencyCode === 'EUR') {
      // Replace "€" with "€ "
      formatted = formatted.replace(/^€/, '€ ');
    }
    return formatted;
  } catch {
    return number.toString();
  }
};
export function formatCustomNumber(
  value: number | string,
  locale: string,
): string {
  const separator = locale.includes('id') ? '.' : ',';

  const numericString =
    typeof value === 'number' ? value.toString() : value.replace(/\D/g, '');
  const reversed = numericString.split('').reverse();

  const grouped = [];
  for (let i = 0; i < reversed.length; i += 3) {
    grouped.push(reversed.slice(i, i + 3).join(''));
  }

  return grouped
    .map(group => group.split('').reverse().join(''))
    .reverse()
    .join(separator);
}
