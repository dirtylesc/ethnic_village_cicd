export function calculateRatingStats(ratings: any) {
  const total = ratings.length;

  if (total === 0) {
    return {
      average: 0,
      total: 0,
    };
  }

  const sum = ratings.reduce((acc: number, curr: any) => acc + curr.rating, 0) as number;
  const average = parseFloat((sum / total).toFixed(1));

  return {
    average,
    total,
  };
}
