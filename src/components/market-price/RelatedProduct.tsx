export const RelatedProduct = () => {
  return (
    <div className="space-y-20">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">연관 상품</h3>
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="aspect-square rounded-lg bg-purple-500" />
              <div className="line-clamp-2 text-sm">상품명</div>
              <div className="text-sm font-semibold">00,000 원</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
