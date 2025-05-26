
export const formatChartData = (pricesArray) => {
    return pricesArray.map(([timestamp, price]) => ({
      date: new Date(timestamp).toLocaleDateString('en-US'), // MM/DD/YYYY
      price: Number(price.toFixed(2)),
    }));
  };