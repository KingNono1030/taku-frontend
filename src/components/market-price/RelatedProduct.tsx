interface SimilarProduct {
  productId: string;
  title: string;
  price: number;
  imageUrl: string;
  tfidfVector: string;
}

interface RelatedProductProps {
  similarProducts: SimilarProduct[];
}

export const RelatedProduct = ({ similarProducts }: RelatedProductProps) => {
  console.log('RelatedProduct data:', similarProducts);

  if (!similarProducts || similarProducts.length === 0) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-white p-4">
        <p className="text-muted-foreground">연관 상품이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-20">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">연관 상품</h3>
        <div className="grid grid-cols-5 gap-4">
          {similarProducts.map((product) => (
            <div key={product.productId} className="space-y-2">
              <div
                className="aspect-square rounded-lg bg-cover bg-center"
                style={{ backgroundImage: `url(${product.imageUrl})` }}
              />
              <div className="line-clamp-2 text-sm">{product.title}</div>
              <div className="text-sm font-semibold">
                {product.price.toLocaleString()} 원
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
