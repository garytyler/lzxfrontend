import {MediaFile} from '@shopify/hydrogen';
import type {
  MediaImage,
  Media,
  Metafield,
  Video as MediaVideo,
} from '@shopify/hydrogen/storefront-api-types';
import type {SerializeFrom} from '@shopify/remix-oxygen';
import clsx from 'clsx';
import {Link} from '~/components/Link';
import {Heading, Text} from '~/components/Text';

export interface CollectionHero {
  byline: Metafield;
  cta: Metafield;
  handle: string;
  heading: Metafield;
  height?: 'full';
  loading?: 'eager' | 'lazy';
  spread: Metafield;
  spreadSecondary: Metafield;
  top?: boolean;
}

/**
 * Hero component that renders metafields attached to collection resources
 **/
export function Hero({
  byline,
  cta,
  handle,
  heading,
  height,
  loading,
  spread,
  spreadSecondary,
  top,
}: SerializeFrom<CollectionHero>) {
  return (
    <section className="px-4 w-full">
      <Heading format as="h2" size="display" className="w-full max-w-max">
        Welcome to LZX Industries
      </Heading>
      <Text format as="p" size="lead" className="w-full max-w-max">
        We make standalone instruments and EuroRack format synthesizer modules
        for video generation and processing.{' '}
        <Link className={' underline text-blue-500'} to={`/patches`}>
          Visit our patch gallery
        </Link>{' '}
        to see what that looks like. Check out our{' '}
        <Link
          className={' underline text-blue-500'}
          to={`/products/double-vision-system`}
        >
          Double Vision System
        </Link>{' '}
        for a complete system available now. Get{' '}
        <Link className={' underline text-blue-500'} to={`/products/esg3`}>
          our ESG3 module
        </Link>{' '}
        to add video output to your EuroRack audio synthesizer. When you&apos;d
        like to engage with our community, visit our{' '}
        <Link
          className={' underline text-blue-500'}
          to={`https://community.lzxindustries.net`}
        >
          forum
        </Link>
        ,{' '}
        <Link
          className={' underline text-blue-500'}
          to={`https://discord.gg/7xzD4XzhGn`}
        >
          chat on Discord
        </Link>{' '}
        or{' '}
        <Link
          className={' underline text-blue-500'}
          to={`mailto:sales@lzxindustries.net`}
        >
          write us an e-mail
        </Link>
        .
      </Text>
    </section>
    // <Link to={`/collections/${handle}`}>
    //   <section
    //     className={clsx(
    //       'relative justify-end flex flex-col w-full',
    //       '-mt-nav',
    //       height === 'full'
    //         ? 'h-screen'
    //         : 'aspect-[4/5] sm:aspect-square md:aspect-[5/4] lg:aspect-[3/2] xl:aspect-[2/1]',
    //     )}
    //   >
    //     <div className="absolute inset-0 grid flex-grow grid-flow-col pointer-events-none auto-cols-fr -z-10 content-stretch overflow-clip">
    //       {spread?.reference && (
    //         <div>
    //           <SpreadMedia
    //             sizes={
    //               spreadSecondary?.reference
    //                 ? '(min-width: 48em) 50vw, 100vw'
    //                 : '100vw'
    //             }
    //             data={spread.reference as Media}
    //             loading={loading}
    //           />
    //         </div>
    //       )}
    //       {spreadSecondary?.reference && (
    //         <div className="hidden md:block">
    //           <SpreadMedia
    //             sizes="50vw"
    //             data={spreadSecondary.reference as Media}
    //             loading={loading}
    //           />
    //         </div>
    //       )}
    //     </div>
    //     <div className="flex flex-col items-baseline justify-between gap-4 px-6 py-8 sm:px-8 md:px-12 bg-gradient-to-t dark:from-contrast/60 dark:text-primary from-primary/60 text-contrast">
    //       {heading?.value && (
    //         <Heading format as="h2" size="display" className="max-w-md">
    //           {heading.value}
    //         </Heading>
    //       )}
    //       {byline?.value && (
    //         <Text format width="narrow" as="p" size="lead">
    //           {byline.value}
    //         </Text>
    //       )}
    //       {cta?.value && <Text size="lead">{cta.value}</Text>}
    //     </div>
    //   </section>
    // </Link>
  );
}

interface SpreadMediaProps {
  data: Media | MediaImage | MediaVideo;
  loading?: HTMLImageElement['loading'];
  sizes: string;
}

function SpreadMedia({data, loading, sizes}: SpreadMediaProps) {
  return (
    <MediaFile
      data={data}
      className="block object-cover w-full h-full"
      mediaOptions={{
        video: {
          controls: false,
          muted: true,
          loop: true,
          playsInline: true,
          autoPlay: true,
          previewImageOptions: {src: data.previewImage?.url ?? ''},
        },
        image: {
          loading,
          crop: 'center',
          sizes,
          alt: data.alt || '',
        },
      }}
    />
  );
}
