import dayjs from 'dayjs';

// Convert transactions to chart data format
export const transformToChartData = (transactions, type = 'expense') => {
  const grouped = transactions
    .filter(item => item.type === type)
    .reduce((acc, curr) => {
      const label = dayjs(curr.created_at).format('D'); // Group by day of month

      if (!acc[label]) acc[label] = 0;
      acc[label] += curr.amount;

      return acc;
    }, {});

  return Object.entries(grouped).map(([label, value]) => ({
    label,
    value,
  }));
};

export const getChartMaxValue = (data: {value: number}[]) => {
  if (data.length === 0) return 1000;

  const max = Math.max(...data.map(d => d.value));
  const magnitude = Math.pow(10, Math.floor(Math.log10(max)));
  const roundedMax = Math.ceil(max / magnitude) * magnitude;

  return roundedMax;
};
