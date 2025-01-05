import {Listbox} from '@headlessui/react';
import {
  useLoaderData,
  useLocation,
  useNavigation,
  useSearchParams,
} from '@remix-run/react';
import type {
  SeoConfig,
  ShopifyAnalyticsProduct,
  Storefront,
} from '@shopify/hydrogen';
import {AnalyticsPageType, getSeoMeta, Money} from '@shopify/hydrogen';
import type {
  ProductConnection,
  Product as ProductType,
  ProductVariant,
  SelectedOptionInput,
  Shop,
} from '@shopify/hydrogen/storefront-api-types';
import type {LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';
import {defer} from '@shopify/remix-oxygen';
import clsx from 'clsx';
import {type ReactNode, useMemo, useRef} from 'react';
import invariant from 'tiny-invariant';
import {AddToCartButton} from '~/components/AddToCartButton';
import {Button} from '~/components/Button';
import {IconCaret, IconCheck} from '~/components/Icon';
import {Link} from '~/components/Link';
import {ModuleDetails} from '~/components/ModuleDetails';
import {Heading, Text} from '~/components/Text';
import {getModuleDetails} from '~/controllers/get_module_details';
import {MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {seoPayload} from '~/lib/seo.server.js';
import type {ModuleView} from '~/views/module.js';



export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {productHandle} = params;
  invariant(productHandle, 'Missing productHandle param, check route filename');

  const searchParams = new URL(request.url).searchParams;

  const selectedOptions: SelectedOptionInput[] = [];
  searchParams.forEach((value, name) => {
    selectedOptions.push({name, value});
  });

  const {shop, product} = await context.storefront.query<{
    product: ProductType & {selectedVariant?: ProductVariant};
    shop: Shop;
  }>(PRODUCT_QUERY, {
    variables: {
      handle: productHandle,
      selectedOptions,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  if (!product?.id) {
    throw new Response('product', {status: 404});
  }

  const recommended = getRecommendedProducts(context.storefront, product.id);
  const firstVariant = product.variants.nodes[0];
  const selectedVariant = product.selectedVariant ?? firstVariant;

  const productAnalytics: ShopifyAnalyticsProduct = {
    productGid: product.id,
    variantGid: selectedVariant.id,
    name: product.title,
    variantName: selectedVariant.title,
    brand: product.vendor,
    price: selectedVariant.price.amount,
  };

  const seo = seoPayload.product({
    product, // Note: there is a field in this value for seo title and description that is getting pulled from Shopify. Any SEO updates need to be made there.
    selectedVariant,
    url: request.url,
  });

  const id = product.id;
  const moduleData: ModuleView = await getModuleDetails(context, id);

  // if (!id || !moduleData) {
  //   throw new Response('product', { status: 404 });
  // }

  return defer({
    moduleData,
    product,
    shop,
    storeDomain: shop.primaryDomain.url,
    recommended,
    analytics: {
      pageType: AnalyticsPageType.product,
      resourceId: product.id,
      products: [productAnalytics],
      totalValue: parseFloat(selectedVariant.price.amount),
    },
    seo,
  });
}

export const meta = ({data}: MetaArgs<typeof loader>) => {
  return getSeoMeta(data!.seo as SeoConfig);
};

export default function Product() {
  const {moduleData, product, shop, recommended} =
    useLoaderData<typeof loader>();
  const {media, title, id, descriptionHtml, vendor} = product;
  const {shippingPolicy, refundPolicy} = shop;
  const isModule = moduleData.hp > 0 ? true : false;
  moduleData.description = descriptionHtml;

  return (
    <ModuleDetails moduleData={moduleData}>
      <ProductForm />
    </ModuleDetails>
  );
}

// <Section className="px-0 md:px-8 lg:px-12">
// <div className="grid items-start md:gap-6 lg:gap-20 md:grid-cols-2 lg:grid-cols-2">
// {isModule ? <ModuleGallery module={moduleData} /> : <ProductGallery media={media.nodes} className="w-full"/>
// }
//   <div className="sticky md:-mb-nav md:top-nav md:-translate-y-nav md:h-screen md:pt-nav hiddenScroll md:overflow-y-scroll">
//     {/* <section className="flex flex-col w-full max-w-xl gap-8 p-6 md:mx-auto md:max-w-sm md:px-0"> */}

//     <div className="inline-block w-1/2 align-top py-4">
//       <div className="inline-block align-top w-full">
//         {/* <Text size="lead">{isModule ? moduleData.brand : vendor}</Text> */}
//         <h1>
//           {isModule ? moduleData.name : title}
//         </h1>
//         <Text size="lead" color="subtle" className="uppercase">{isModule ? moduleData.subtitle : null}</Text>
//       </div>
//     </div>
//     <div className="inline-block w-1/2 align-top py-4">
//       <div className="inline-block align-top w-full h-full">
//         <ProductForm />
//       </div>
//     </div>
//     {isModule ? <ModuleDetails moduleData={moduleData} /> : <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />}
//     {/* <div className="grid gap-4 py-4">
//         {viewDescription && (
//           <ProductDetail
//             title="Description"
//             content={viewDescription}
//           />
//         )}
//         {shippingPolicy?.body && (
//           <ProductDetail
//             title="Shipping"
//             content={getExcerpt(shippingPolicy.body)}
//             learnMore={`/policies/${shippingPolicy.handle}`}
//           />
//         )}
//         {refundPolicy?.body && (
//           <ProductDetail
//             title="Returns"
//             content={getExcerpt(refundPolicy.body)}
//             learnMore={`/policies/${refundPolicy.handle}`}
//           />
//         )}
//       </div> */}
//   </div>
// </div>
// </Section>
// {/* <Suspense fallback={<Skeleton className="h-32" />}>
// <Await
//   errorElement="There was a problem loading related products"
//   resolve={recommended}
// >
//   {(products) => (
//     <ProductSwimlane title="Patching Partners" products={products} />
//   )}
// </Await>
// </Suspense> */}
export function ProductForm() {
  const {product, analytics, storeDomain} = useLoaderData<typeof loader>();
  const [currentSearchParams] = useSearchParams();
  const {location} = useNavigation();

  /**
   * We update `searchParams` with in-flight request data from `location` (if available)
   * to create an optimistic UI, e.g. check the product option before the
   * request has completed.
   */
  const searchParams = useMemo(() => {
    return location
      ? new URLSearchParams(location.search)
      : currentSearchParams;
  }, [currentSearchParams, location]);

  const firstVariant = product.variants.nodes[0];

  /**
   * We're making an explicit choice here to display the product options
   * UI with a default variant, rather than wait for the user to select
   * options first. Developers are welcome to opt-out of this behavior.
   * By default, the first variant's options are used.
   */
  const searchParamsWithDefaults = useMemo<URLSearchParams>(() => {
    const clonedParams = new URLSearchParams(searchParams);

    for (const {name, value} of firstVariant.selectedOptions) {
      if (!searchParams.has(name)) {
        clonedParams.set(name, value);
      }
    }

    return clonedParams;
  }, [searchParams, firstVariant.selectedOptions]);

  /**
   * Likewise, we're defaulting to the first variant for purposes
   * of add to cart if there is none returned from the loader.
   * A developer can opt out of this, too.
   */
  const selectedVariant = product.selectedVariant ?? firstVariant;
  const isOutOfStock = !selectedVariant?.availableForSale;
  const isPreorder = product.id == 'gid://shopify/Product/4319674761239';
  const isBackorder =
    (selectedVariant?.quantityAvailable ?? 0) <= 0 && !isPreorder
      ? true
      : false;
  const productQty = selectedVariant?.quantityAvailable;
  const isOnSale =
    selectedVariant?.price?.amount &&
    selectedVariant?.compareAtPrice?.amount &&
    selectedVariant?.price?.amount < selectedVariant?.compareAtPrice?.amount;

  const productAnalytics: ShopifyAnalyticsProduct = {
    ...analytics.products[0],
    quantity: 1,
  };

  return (
    <div className="grid gap-2">
      <div className="grid gap-4">
        <ProductOptions
          options={product.options}
          searchParamsWithDefaults={searchParamsWithDefaults}
        />
        {selectedVariant && (
          <div className="grid items-stretch gap-4">
            {isOutOfStock ? (
              <Button variant="secondary" disabled>
                <Text>Sold Out</Text>
              </Button>
            ) : null}
            {!isOutOfStock && !isPreorder && !isBackorder ? (
              <AddToCartButton
                lines={[
                  {
                    merchandiseId: selectedVariant.id,
                    quantity: 1,
                  },
                ]}
                variant="primary"
                data-test="add-to-cart"
                analytics={{
                  products: [productAnalytics],
                  totalValue: parseFloat(productAnalytics.price),
                }}
              >
                <Text
                  as="span"
                  className="flex items-center justify-center gap-2"
                >
                  <span>Add to Cart</span> <span>·</span>{' '}
                  <Money
                    withoutTrailingZeros
                    data={selectedVariant?.price!}
                    as="span"
                  />
                  {isOnSale && (
                    <Money
                      withoutTrailingZeros
                      data={selectedVariant?.compareAtPrice!}
                      as="span"
                      className="opacity-50 strike"
                    />
                  )}
                </Text>
              </AddToCartButton>
            ) : null}
            {!isOutOfStock && isPreorder && !isBackorder ? (
              <AddToCartButton
                lines={[
                  {
                    merchandiseId: selectedVariant.id,
                    quantity: 1,
                  },
                ]}
                variant="primary"
                data-test="add-to-cart"
                analytics={{
                  products: [productAnalytics],
                  totalValue: parseFloat(productAnalytics.price),
                }}
              >
                <Text
                  as="span"
                  className="flex items-center justify-center gap-2"
                >
                  <span>Preorder Now</span> <span>·</span>{' '}
                  <Money
                    withoutTrailingZeros
                    data={selectedVariant?.price!}
                    as="span"
                  />
                  {isOnSale && (
                    <Money
                      withoutTrailingZeros
                      data={selectedVariant?.compareAtPrice!}
                      as="span"
                      className="opacity-50 strike"
                    />
                  )}
                </Text>
              </AddToCartButton>
            ) : null}

            {!isOutOfStock && isBackorder && !isPreorder ? (
              <AddToCartButton
                lines={[
                  {
                    merchandiseId: selectedVariant.id,
                    quantity: 1,
                  },
                ]}
                variant="primary"
                data-test="add-to-cart"
                analytics={{
                  products: [productAnalytics],
                  totalValue: parseFloat(productAnalytics.price),
                }}
              >
                <Text
                  as="span"
                  className="flex items-center justify-center gap-2"
                >
                  <span>Backorder Now</span> <span>·</span>{' '}
                  <Money
                    withoutTrailingZeros
                    data={selectedVariant?.price!}
                    as="span"
                  />
                  {isOnSale && (
                    <Money
                      withoutTrailingZeros
                      data={selectedVariant?.compareAtPrice!}
                      as="span"
                      className="opacity-50 strike"
                    />
                  )}
                </Text>
              </AddToCartButton>
            ) : null}

            {!isOutOfStock && !isPreorder && !isBackorder ? (
              <Text as="span">{productQty} in stock.</Text>
            ) : null}

            {isOutOfStock ? (
              <Text as="span">
                Out of stock. Please{' '}
                <Link to={'mailto:sales@lzxindustries.net'}>contact us</Link> to
                let us know about your interest in this item!
              </Text>
            ) : null}

            {!isOutOfStock && isPreorder && !isBackorder ? (
              <Text as="span">
                This product is not shipping, but is available for preorder.
                Please place your order only if you are prepared to wait.
              </Text>
            ) : null}

            {!isOutOfStock && isBackorder && !isPreorder ? (
              <Text as="span">Backorders ship within 4-6 weeks.</Text>
            ) : null}

            {/* {!isOutOfStock && (
              <ShopPayButton
                width="100%"
                variantIds={[selectedVariant?.id!]}
                storeDomain={storeDomain}
              />
            )} */}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductOptions({
  options,
  searchParamsWithDefaults,
}: {
  options: ProductType['options'];
  searchParamsWithDefaults: URLSearchParams;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      {options
        .filter((option) => option.values.length > 1)
        .map((option) => (
          <div
            key={option.name}
            className="flex flex-col flex-wrap mb-4 gap-y-2 last:mb-0"
          >
            <Heading as="legend" size="lead" className="min-w-[4rem]">
              {option.name}
            </Heading>
            <div className="flex flex-wrap items-baseline gap-4">
              {/**
               * First, we render a bunch of <Link> elements for each option value.
               * When the user clicks one of these buttons, it will hit the loader
               * to get the new data.
               *
               * If there are more than 7 values, we render a dropdown.
               * Otherwise, we just render plain links.
               */}
              {option.values.length > 7 ? (
                <div className="relative w-full">
                  <Listbox>
                    {({open}) => (
                      <>
                        <Listbox.Button
                          ref={closeRef}
                          className={clsx(
                            'flex items-center justify-between w-full py-3 px-4 border border-primary',
                            open
                              ? 'rounded-b md:rounded-t md:rounded-b-none'
                              : 'rounded',
                          )}
                        >
                          <span>
                            {searchParamsWithDefaults.get(option.name)}
                          </span>
                          <IconCaret direction={open ? 'up' : 'down'} />
                        </Listbox.Button>
                        <Listbox.Options
                          className={clsx(
                            'border-primary bg-white absolute bottom-12 z-50 grid h-48 w-full overflow-y-scroll rounded-t border px-2 py-2 transition-[max-height] duration-150 sm:bottom-auto md:rounded-b md:rounded-t-none md:border-t-0 md:border-b',
                            open ? 'max-h-48' : 'max-h-0',
                          )}
                        >
                          {option.values.map((value) => (
                            <Listbox.Option
                              key={`option-${option.name}-${value}`}
                              value={value}
                            >
                              {({active}) => (
                                <ProductOptionLink
                                  optionName={option.name}
                                  optionValue={value}
                                  className={clsx(
                                    'text-primary w-full p-2 transition rounded flex justify-start items-center text-left cursor-pointer',
                                    active && 'bg-primary/10',
                                  )}
                                  searchParams={searchParamsWithDefaults}
                                  onClick={() => {
                                    if (!closeRef?.current) return;
                                    closeRef.current.click();
                                  }}
                                >
                                  {value}
                                  {searchParamsWithDefaults.get(option.name) ===
                                    value && (
                                    <span className="ml-2">
                                      <IconCheck />
                                    </span>
                                  )}
                                </ProductOptionLink>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </>
                    )}
                  </Listbox>
                </div>
              ) : (
                <>
                  {option.values.map((value) => {
                    const checked =
                      searchParamsWithDefaults.get(option.name) === value;
                    const id = `option-${option.name}-${value}`;

                    return (
                      <Text key={id}>
                        <ProductOptionLink
                          optionName={option.name}
                          optionValue={value}
                          searchParams={searchParamsWithDefaults}
                          className={clsx(
                            'leading-none py-1 border-b-[1.5px] cursor-pointer transition-all duration-200',
                            checked ? 'font-extrabold' : 'font-normal',
                          )}
                        />
                      </Text>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        ))}
    </>
  );
}

function ProductOptionLink({
  optionName,
  optionValue,
  searchParams,
  children,
  ...props
}: {
  optionName: string;
  optionValue: string;
  searchParams: URLSearchParams;
  children?: ReactNode;
  [key: string]: any;
}) {
  const {pathname} = useLocation();
  const isLangPathname = /\/[a-zA-Z]{2}-[a-zA-Z]{2}\//g.test(pathname);
  // fixes internalized pathname
  const path = isLangPathname
    ? `/${pathname.split('/').slice(2).join('/')}`
    : pathname;

  const clonedSearchParams = new URLSearchParams(searchParams);
  clonedSearchParams.set(optionName, optionValue);

  return (
    <Link
      {...props}
      preventScrollReset
      prefetch="intent"
      replace
      to={`${path}?${clonedSearchParams.toString()}`}
    >
      {children ?? optionValue}
    </Link>
  );
}

// function ProductDetail({
//   title,
//   content,
//   learnMore,
// }: {
//   title: string;
//   content: string;
//   learnMore?: string;
// }) {
//   return (
//     <Disclosure key={title} as="div" className="grid w-full gap-2">
//       {({ open }) => (
//         <>
//           <Disclosure.Button className="text-left">
//             <div className="flex justify-between">
//               <Text size="lead" as="h4">
//                 {title}
//               </Text>
//               <IconClose
//                 className={clsx(
//                   'transition-transform transform-gpu duration-200',
//                   !open && 'rotate-[45deg]',
//                 )}
//               />
//             </div>
//           </Disclosure.Button>

//           <Disclosure.Panel className={'pb-4 pt-2 grid gap-2'}>
//             <div
//               className="prose dark:prose-invert"
//               dangerouslySetInnerHTML={{ __html: content }}
//             />
//             {learnMore && (
//               <div className="">
//                 <Link
//                   className="pb-px border-b border-primary/30 text-primary/50"
//                   to={learnMore}
//                 >
//                   Learn more
//                 </Link>
//               </div>
//             )}
//           </Disclosure.Panel>
//         </>
//       )}
//     </Disclosure>
//   );
// }

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariantFragment on ProductVariant {
    id
    availableForSale
    quantityAvailable
    selectedOptions {
      name
      value
    }
    image {
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
  }
`;

const PRODUCT_QUERY = `#graphql
  ${MEDIA_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
  query Product(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      vendor
      handle
      descriptionHtml
      description
      options {
        name
        values
      }
      selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
        ...ProductVariantFragment
      }
      media(first: 7) {
        nodes {
          ...Media
        }
      }
      variants(first: 1) {
        nodes {
          ...ProductVariantFragment
        }
      }
      seo {
        description
        title
      }
    }
    shop {
      name
      primaryDomain {
        url
      }
      shippingPolicy {
        body
        handle
      }
      refundPolicy {
        body
        handle
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query productRecommendations(
    $productId: ID!
    $count: Int
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    recommended: productRecommendations(productId: $productId) {
      ...ProductCard
    }
    additional: products(first: $count, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
`;

async function getRecommendedProducts(
  storefront: Storefront,
  productId: string,
) {
  const products = await storefront.query<{
    recommended: ProductType[];
    additional: ProductConnection;
  }>(RECOMMENDED_PRODUCTS_QUERY, {
    variables: {productId, count: 12},
  });

  invariant(products, 'No data returned from Shopify API');

  const mergedProducts: ProductType[] = products.recommended
    .concat(products.additional.nodes)
    .filter(
      (value, index, array) =>
        array.findIndex((value2) => value2.id === value.id) === index,
    );

  const originalProduct = mergedProducts
    .map((item: ProductType) => item.id)
    .indexOf(productId);

  mergedProducts.splice(originalProduct, 1);

  return mergedProducts;
}
