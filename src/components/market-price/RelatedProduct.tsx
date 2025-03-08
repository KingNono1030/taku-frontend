import FallbackImage from '../avatar/FallbackImage';

interface SimilarProduct {
  productId: string | number;
  title: string;
  price: number;
  imageUrl: string;
}

interface RelatedProductProps {
  similarProducts: [string, SimilarProduct][];
}

export const RelatedProduct = ({ similarProducts }: RelatedProductProps) => {
  if (!similarProducts || similarProducts.length === 0) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-white p-4">
        <p className="text-muted-foreground">연관 상품이 없습니다.</p>
      </div>
    );
  }

  // 배열의 두 번째 요소(인덱스 1)에서 실제 상품 데이터를 추출
  const products = similarProducts.map((item) => item[1]);

  return (
    <div className="space-y-20">
      <div className="mb-10 space-y-4">
        <h3 className="text-lg font-semibold">연관 상품</h3>
        <div className="grid grid-cols-5 gap-4">
          {products.map((product) => (
            <div key={product.productId} className="space-y-2">
              <div className="aspect-square">
                <FallbackImage
                  src={product.imageUrl}
                  alt={product.title}
                  className="object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              <div className="line-clamp-2 text-sm">{product.title}</div>
              <div className="text-sm font-semibold">
                {(product.price ?? 0).toLocaleString()} 원
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
