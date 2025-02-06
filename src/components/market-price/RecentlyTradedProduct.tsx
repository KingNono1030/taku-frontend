interface RecentlyTradedProductProps {
  weeklyStats: {
    averagePrice: number;
    highestPrice: number;
    lowestPrice: number;
    totalDeals: number;
  };
}

export const RecentlyTradedProduct = ({
  weeklyStats,
}: RecentlyTradedProductProps) => {
  const stats = [
    { label: '평균 거래가', value: weeklyStats.averagePrice },
    { label: '최고 거래가', value: weeklyStats.highestPrice },
    { label: '최저 거래가', value: weeklyStats.lowestPrice },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">최근 거래된 상품 (일주일 내)</h3>
      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ label, value }, index) => (
          <div key={index} className="rounded-lg bg-muted p-4 text-center">
            <div className="text-sm text-muted-foreground">{label}</div>
            <div className="mt-1 font-semibold">
              {value.toLocaleString()} 원
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
