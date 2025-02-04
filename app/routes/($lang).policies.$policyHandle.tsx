import {useLoaderData} from '@remix-run/react';
import type {SeoConfig} from '@shopify/hydrogen';
import {getSeoMeta} from '@shopify/hydrogen';
import type {ShopPolicy} from '@shopify/hydrogen/storefront-api-types';
import {json} from '@shopify/remix-oxygen';
import type {MetaArgs, LoaderFunctionArgs} from '@shopify/remix-oxygen';
import invariant from 'tiny-invariant';
import {Button} from '~/components/Button';
import {Section, PageHeader} from '~/components/Text';
import {routeHeaders, CACHE_LONG} from '~/data/cache';
import {seoPayload} from '~/lib/seo.server';

export const headers = routeHeaders;

export async function loader({request, params, context}: LoaderFunctionArgs) {
  invariant(params.policyHandle, 'Missing policy handle');
  const handle = params.policyHandle;

  const policyName = handle.replace(/-([a-z])/g, (_: unknown, m1: string) =>
    m1.toUpperCase(),
  );

  const data = await context.storefront.query<{
    shop: Record<string, ShopPolicy>;
  }>(POLICY_CONTENT_QUERY, {
    variables: {
      privacyPolicy: false,
      shippingPolicy: false,
      termsOfService: false,
      refundPolicy: false,
      [policyName]: true,
      language: context.storefront.i18n.language,
    },
  });

  invariant(data, 'No data returned from Shopify API');
  const policy = data.shop?.[policyName];

  if (!policy) {
    throw new Response(null, {status: 404});
  }

  const seo = seoPayload.policy({policy, url: request.url});

  return json(
    {policy, seo},
    {
      headers: {
        'Cache-Control': CACHE_LONG,
        'Oxygen-Cache-Control':
          'public, max-age=3600, stale-while-revalidate=600',
      },
    },
  );
}

export const meta = ({data}: MetaArgs<typeof loader>) => {
  return getSeoMeta(data!.seo as SeoConfig);
};

export default function Policies() {
  const {policy} = useLoaderData<typeof loader>();

  return (
    <>
      <Section
        padding="all"
        display="flex"
        className="flex-col items-baseline w-full gap-8 md:flex-row"
      >
        <PageHeader
          heading={policy.title}
          className="grid items-start flex-grow gap-4 md:sticky top-36 md:w-5/12"
        >
          <Button
            className="justify-self-start"
            variant="inline"
            to={'/policies'}
          >
            &larr; Back to Policies
          </Button>
        </PageHeader>
        <div className="flex-grow w-full md:w-7/12">
          <div
            dangerouslySetInnerHTML={{__html: policy.body}}
            className="prose dark:prose-invert"
          />
        </div>
      </Section>
    </>
  );
}

const POLICY_CONTENT_QUERY = `#graphql
  fragment PolicyContent on ShopPolicy {
    body
    handle
    id
    title
    url
  }

  query PolicyContentsQuery(
    $language: LanguageCode
    $privacyPolicy: Boolean!
    $shippingPolicy: Boolean!
    $termsOfService: Boolean!
    $refundPolicy: Boolean!
  ) @inContext(language: $language) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) {
        ...PolicyContent
      }
      shippingPolicy @include(if: $shippingPolicy) {
        ...PolicyContent
      }
      termsOfService @include(if: $termsOfService) {
        ...PolicyContent
      }
      refundPolicy @include(if: $refundPolicy) {
        ...PolicyContent
      }
    }
  }
`;
