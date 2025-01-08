import type {
  Product,
  Media,
  ExternalVideo,
  MediaImage,
} from '@shopify/hydrogen/storefront-api-types';
import React, {useState} from 'react';
import ImageCroppedByTransparency from './ImageCroppedByTransparency';

enum MediaGalleryItemType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

interface MediaGalleryItem {
  name: string;
  src: string;
  type: MediaGalleryItemType;
}

interface ProductMediaGalleryProps {
  product: Product;
  moduleData: any;
}

function getLastPathSegment(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    const segments = parsedUrl.pathname
      .split('/')
      .filter((segment) => segment.length > 0);
    return segments.length > 0 ? segments[segments.length - 1] : null;
  } catch (error) {
    console.error('Invalid URL:', error);
    return null;
  }
}

const ProductMediaGallery: React.FC<ProductMediaGalleryProps> = ({
  product,
  moduleData,
}) => {
  const mediaGalleryItems: MediaGalleryItem[] = [];

  const seenYoutubeIds = new Set<string>();
  product.media.nodes.forEach((item: Media, index) => {
    if (item.mediaContentType === 'IMAGE') {
      const shopifyImage = item as MediaImage;
      if (!shopifyImage.image) return;
      mediaGalleryItems.push({
        name: shopifyImage.image.altText || `${moduleData.name} image`,
        src: shopifyImage.image.url,
        type: MediaGalleryItemType.IMAGE,
      } as MediaGalleryItem);
    } else if (item.mediaContentType === 'EXTERNAL_VIDEO') {
      const shopifyExternalVideo = item as ExternalVideo;
      const youtubeId = getLastPathSegment(shopifyExternalVideo.embedUrl);
      if (!youtubeId) return;
      seenYoutubeIds.add(youtubeId);
      mediaGalleryItems.push({
        name: `${moduleData.name} video (${shopifyExternalVideo.host})`,
        src: shopifyExternalVideo.embedUrl,
        type: MediaGalleryItemType.VIDEO,
      } as MediaGalleryItem);
    }
  });

  moduleData.videos.forEach((video: any) => {
    if (seenYoutubeIds.has(video.youtube)) return;
    mediaGalleryItems.push({
      name: video.name,
      src: `https://www.youtube.com/embed/${video.youtube}`,
      type: MediaGalleryItemType.VIDEO,
    } as MediaGalleryItem);
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % mediaGalleryItems.length);
  const prevSlide = () =>
    setCurrentSlide(
      (prev) =>
        (prev - 1 + mediaGalleryItems.length) % mediaGalleryItems.length,
    );

  return (
    <div className="w-full lg:w-1/2 card-image">
      <div className="flex-row">
        <div className="flex items-center relative aspect-square p-1 lg:p-2">
          <button
            onClick={prevSlide}
            className="mb-0 p-0 text-black rounded-full bg-white any-hover:hover:bg-black any-hover:hover:text-white border border-gray-500 transition-colors duration-200 md:p-1 lg:p-1 m-0 lg:m-1"
            aria-label="Previous Slide"
            style={{
              visibility: mediaGalleryItems.length <= 1 ? 'hidden' : 'visible',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="flex justify-center w-full h-full p-1 lg:p-2 overflow-hidden ">
            {mediaGalleryItems[currentSlide].type ===
            MediaGalleryItemType.IMAGE ? (
              <div className="object-contain">
                <ImageCroppedByTransparency
                  src={mediaGalleryItems[currentSlide].src}
                  alt={mediaGalleryItems[currentSlide].name}
                />
                {/* <img
                  className="w-full h-full object-contain"
                  src={mediaGalleryItems[currentSlide].src}
                  alt={mediaGalleryItems[currentSlide].name}
                /> */}
              </div>
            ) : mediaGalleryItems[currentSlide].type ===
              MediaGalleryItemType.VIDEO ? (
              <div className="w-full ">
                <div className="relative inset-y-[25%]">
                  <iframe
                    className="aspect-video w-full "
                    src={mediaGalleryItems[currentSlide].src}
                    title={mediaGalleryItems[currentSlide].name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  />
                </div>
              </div>
            ) : null}
          </div>
          <button
            onClick={nextSlide}
            className="mb-0 p-0 text-black rounded-full bg-white any-hover:hover:bg-black any-hover:hover:text-white border border-gray-500 transition-colors duration-200 md:p-1 lg:p-1 m-0 lg:m-1"
            aria-label="Next Slide"
            style={{
              visibility: mediaGalleryItems.length <= 1 ? 'hidden' : 'visible',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
        {mediaGalleryItems.length > 1 && (
          <div
            className="flex justify-center items-center mb-2 mt-0 pt-0"
            style={{
              visibility: mediaGalleryItems.length <= 1 ? 'hidden' : 'visible',
            }}
          >
            <div className="inline-flex justify-center items-center bg-white rounded-full any-hover:hover:bg-gray-100 border border-gray-500 transition-colors duration-200 p-2 mx-auto">
              {mediaGalleryItems.map((_, index) => (
                <button
                  key={
                    mediaGalleryItems.length > 1
                      ? mediaGalleryItems[index].name
                      : ''
                  }
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 mx-1 rounded-full any-hover:hover:bg-black ${
                    index === currentSlide ? 'bg-black' : 'bg-gray-300'
                  }`}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductMediaGallery;
