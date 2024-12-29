import type {ShopifyAnalyticsProduct} from '@shopify/hydrogen';
import {flattenConnection, useMoney} from '@shopify/hydrogen';
import type {MoneyV2, Product} from '@shopify/hydrogen/storefront-api-types';
import clsx from 'clsx';
import {useState} from 'react';
import {AddToCartButton} from '~/components/AddToCartButton';
import {Link} from '~/components/Link';
import {Text} from '~/components/Text';
import {getProductPlaceholder} from '~/lib/placeholders';
import {isDiscounted, isNewArrival} from '~/lib/utils';

export function ProductCardBackgroundSVG() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 18">
      <defs>
        <pattern id="Pattern" x="0" y="0" width=".25" height=".25">
          <path d="M61.82 18c3.47-1.45 6.86-3.78 11.3-7.34C78 6.76 80.34 5.1 83.87 3.42 88.56 1.16 93.75 0 100 0v6.16C98.76 6.05 97.43 6 96 6c-9.59 0-14.23 2.23-23.13 9.34-1.28 1.03-2.39 1.9-3.4 2.66h-7.65zm-23.64 0H22.52c-1-.76-2.1-1.63-3.4-2.66C11.57 9.3 7.08 6.78 0 6.16V0c6.25 0 11.44 1.16 16.14 3.42 3.53 1.7 5.87 3.35 10.73 7.24 4.45 3.56 7.84 5.9 11.31 7.34zM61.82 0h7.66a39.57 39.57 0 0 1-7.34 4.58C57.44 6.84 52.25 8 46 8S34.56 6.84 29.86 4.58A39.57 39.57 0 0 1 22.52 0h15.66C41.65 1.44 45.21 2 50 2c4.8 0 8.35-.56 11.82-2z" />
        </pattern>
      </defs>

      <rect fill="url(#Pattern)" stroke="black" width="100" height="18" />
    </svg>
  );
}

export function ProductCard({
  product,
  label,
  className,
  loading,
  onClick,
  quickAdd,
}: {
  product: Product;
  label?: string;
  className?: string;
  loading?: HTMLImageElement['loading'];
  onClick?: () => void;
  quickAdd?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleOnClick = () => {
    setIsLoading(true);
    if (onClick) {
      onClick();
    }
    // Simulate loading completion (e.g., API call completion)
    setTimeout(() => setIsLoading(false), 10000); // Replace with actual logic
  };

  let cardLabel;

  const cardProduct: Product = product?.variants
    ? (product as Product)
    : getProductPlaceholder();

  const variants = flattenConnection(cardProduct?.variants);
  const firstVariant = variants.length ? variants[0] : null;

  const {currencyNarrowSymbol, withoutTrailingZerosAndCurrency} = useMoney(
    firstVariant?.price || {amount: '0', currencyCode: 'USD'},
  );

  if (!cardProduct?.variants?.nodes?.length) return null;

  if (!firstVariant) return null;

  const {image, price, compareAtPrice} = firstVariant;

  if (label) {
    cardLabel = label;
  } else if (isDiscounted(price as MoneyV2, compareAtPrice as MoneyV2)) {
    cardLabel = 'Sale';
  } else if (isNewArrival(product.publishedAt)) {
    cardLabel = 'New';
  }

  const productAnalytics: ShopifyAnalyticsProduct = {
    productGid: product.id,
    variantGid: firstVariant.id,
    name: product.title,
    variantName: firstVariant.title,
    brand: product.vendor,
    price: firstVariant.price.amount,
    quantity: 1,
  };

  const imageLocal = '';
  // product.title == 'Angles' ? imageLocal = '/images/angles-front-panel.svg' : ''
  // product.title == 'Chromagnon' ? imageLocal = '/images/chromagnon-front-panel.png' : ''

  // var is2Cols = false
  // product.title == 'Chromagnon' ? is2Cols = true : ''

  return (
    <div className="flex flex-col gap-2">
      <Link
        onClick={handleOnClick}
        to={`/products/${product.handle}`}
        prefetch="intent"
        className="relative"
      >
        <div className={clsx('grid gap-4', className)}>
          <div className="card-image aspect-square bg-primary/5 relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                <div className="loader border-8 border-primary border-t-transparent rounded-full w-14 h-14 animate-spin" />
              </div>
            )}
            {image && (
              <img
                src={image.url}
                alt={`${product.title} product`}
                className="inset-0 w-full h-full object-cover"
              />
            )}
          </div>
          <div className="grid gap-1">
            <Text
              className="w-full font-semibold text-center overflow-hidden whitespace-nowrap text-ellipsis top-0"
              as="p"
              size="copy"
            >
              {product.title}
            </Text>
            <Text
              className="w-full font-medium text-center overflow-hidden whitespace-nowrap text-ellipsis top-0 mt-0 pt-0"
              as="p"
              size="copy"
            >
              {currencyNarrowSymbol}
              {withoutTrailingZerosAndCurrency}
            </Text>
          </div>
        </div>
      </Link>
      {quickAdd && (
        <AddToCartButton
          lines={[
            {
              quantity: 1,
              merchandiseId: firstVariant.id,
            },
          ]}
          variant="secondary"
          className="mt-2"
        >
          <Text as="span" className="flex items-center justify-center gap-2">
            Add to Bag
          </Text>
        </AddToCartButton>
      )}
    </div>
  );
}

function CompareAtPrice({
  data,
  className,
}: {
  data: MoneyV2;
  className?: string;
}) {
  const {currencyNarrowSymbol, withoutTrailingZerosAndCurrency} =
    useMoney(data);

  const styles = clsx('strike', className);

  return (
    <span className={styles}>
      {currencyNarrowSymbol}
      {withoutTrailingZerosAndCurrency}
    </span>
  );
}
