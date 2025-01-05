import React, {useState, useEffect} from 'react';
import {TbRectangleFilled} from 'react-icons/tb';
import ImageCroppedByTransparency from './ImageCroppedByTransparency';
import MarkdownContent from './MarkdownContent';
import {ModuleLegendPanel} from './ModuleLegendPanel';
import type {ModuleView} from '~/views/module';

interface MediaItem {
  name: string;
  type: 'image' | 'video';
  src: string;
}

export function ModuleDetails({
  children,
  moduleData,
}: {
  children?: React.ReactNode;
  moduleData: ModuleView;
}) {
  const [activeRefDes, setActiveRefDes] = useState('');
  let hasMainFeatures = false;
  let hasPatchFeatures = false;
  let hasSystemFeatures = false;
  moduleData.features.forEach((feature) => {
    if (feature.topic === 'Main') hasMainFeatures = true;
    if (feature.topic === 'Patch') hasPatchFeatures = true;
    if (feature.topic === 'System') hasSystemFeatures = true;
  });
  const portraitAspect = moduleData.hp >= 25;

  const media: MediaItem[] = [
    {
      name: 'Front Panel',
      type: 'image',
      src: '/images/' + moduleData.frontpanel,
    },
  ];
  moduleData.videos.forEach((video) =>
    media.push({
      name: video.name,
      type: 'video',
      src: 'https://www.youtube.com/embed/' + video.youtube,
    }),
  );

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % media.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + media.length) % media.length);
  const [screenWidth, setScreenWidth] = useState<number>(0);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      key="ModuleDetails"
      className="flex flex-wrap flex-row justify-center p-0 m-0"
    >
      <div className="w-full lg:w-1/2 card-image">
        <div className="flex-row">
          <div className="flex items-center relative aspect-square p-1 lg:p-2">
            <button
              onClick={prevSlide}
              className="mb-0 p-0 text-black rounded-full bg-white any-hover:hover:bg-black any-hover:hover:text-white border border-gray-500 transition-colors duration-200 md:p-1 lg:p-1 m-0 lg:m-1"
              aria-label="Next Slide"
              style={{visibility: media.length <= 1 ? 'hidden' : 'visible'}}
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
              {/* <div className="flex justify-center w-full h-[400px] sm:h-[500px] md:h-[800px] lg:h-[800px] xl:h-[1100px]"> */}
              {media[currentSlide].type === 'image' ? (
                <div className="object-contain">
                  <ImageCroppedByTransparency
                    src={media[currentSlide].src}
                    alt="Cropped Module Image"
                  />
                </div>
              ) : (
                <div className="w-full ">
                  <div className="relative inset-y-[25%]">
                    <iframe
                      className="aspect-video w-full "
                      src={media[currentSlide].src}
                      title="Video Slide"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                    />
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={nextSlide}
              className="mb-0 p-0 text-black rounded-full bg-white any-hover:hover:bg-black any-hover:hover:text-white border border-gray-500 transition-colors duration-200 md:p-1 lg:p-1 m-0 lg:m-1"
              aria-label="Next Slide"
              style={{visibility: media.length <= 1 ? 'hidden' : 'visible'}}
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
          {media.length > 1 && (
            <div
              className="flex justify-center items-center mb-2 mt-0 pt-0"
              style={{visibility: media.length <= 1 ? 'hidden' : 'visible'}}
            >
              <div className="inline-flex justify-center items-center bg-white rounded-full any-hover:hover:bg-gray-100 border border-gray-500 transition-colors duration-200 p-2 mx-auto">
                {media.map((_, index) => (
                  <button
                    key={media.length > 1 ? media[index].name : ''}
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
      <div className="basis-[100%] md:basis-1/2 md:h-screen hiddenScroll md:overflow-y-scroll">
        <div className="flex flex-wrap flex-row px-8">
          <div className="basis-[100%] md:basis-1/2 pb-8">
            <div className="font-sans font-bold text-3xl uppercase">
              {moduleData.name}
            </div>
            <div className="font-sans font-semibold text-base uppercase">
              {moduleData.subtitle}
            </div>
          </div>
          <div className="basis-[100%] md:basis-1/2 pb-8">{children}</div>
        </div>
        <article key="ModuleDetailsArticle" className="prose px-8">
          <p dangerouslySetInnerHTML={{__html: moduleData.description}}></p>
          {hasMainFeatures
            ? moduleData.features.map((feature) => {
                return feature.topic == 'Main' ? (
                  <div key={`${moduleData.name}-${feature.name}`}>
                    <h2>
                      <TbRectangleFilled className="inline-block align-middle" />{' '}
                      <span className="align-middle">{feature.name}</span>
                    </h2>
                    <p
                      dangerouslySetInnerHTML={{__html: feature.description}}
                    ></p>
                  </div>
                ) : (
                  ''
                );
              })
            : ''}
          <div className="flex flex-wrap flex-row">
            <div className="basis-[100%] md:basis-1/2">
              {moduleData.hp > 0 && moduleData.mounting_depth_mm > 0 ? (
                <>
                  <h3>Dimensions</h3>
                  <p>
                    {'Width, ' + moduleData.hp + 'HP'}
                    <br />
                    {'Mounting Depth, ' + moduleData.mounting_depth_mm + 'mm'}
                  </p>
                </>
              ) : (
                ''
              )}
            </div>
            <div className="basis-[100%] md:basis-1/2">
              {moduleData.has_rear_video_sync_input !== true &&
              moduleData.has_rear_video_sync_output !== true &&
              moduleData.has_front_video_sync_input !== true &&
              moduleData.has_front_video_sync_output !== true &&
              moduleData.has_eurorack_power_sync_input !== true &&
              moduleData.has_eurorack_power_sync_output !== true &&
              moduleData.has_rear_14_pin_sync_input !== true &&
              moduleData.has_rear_14_pin_sync_output !== true ? (
                ''
              ) : (
                <>
                  <h3>Video Sync</h3>
                  <p>
                    {moduleData.has_rear_video_sync_input == true ? (
                      <>
                        Rear RCA Sync Input Jack
                        <br />
                      </>
                    ) : (
                      ''
                    )}
                    {moduleData.has_rear_video_sync_output == true ? (
                      <>
                        Rear RCA Sync Output Jack
                        <br />
                      </>
                    ) : (
                      ''
                    )}
                    {moduleData.has_front_video_sync_input == true ? (
                      <>
                        Front RCA Sync Input Jack
                        <br />
                      </>
                    ) : (
                      ''
                    )}
                    {moduleData.has_front_video_sync_output == true ? (
                      <>
                        Front RCA Sync Output Jack
                        <br />
                      </>
                    ) : (
                      ''
                    )}
                    {moduleData.has_eurorack_power_sync_input == true ? (
                      <>
                        Rear EuroRack Power Header Sync Input (CV/Gate Bus)
                        <br />
                      </>
                    ) : (
                      ''
                    )}
                    {moduleData.has_eurorack_power_sync_output == true ? (
                      <>
                        Rear EuroRack Power Header Sync Output (CV/Gate Bus)
                        <br />
                      </>
                    ) : (
                      ''
                    )}
                    {moduleData.has_rear_14_pin_sync_input == true ? (
                      <>
                        Rear 14 Pin Header Sync Input
                        <br />
                      </>
                    ) : (
                      ''
                    )}
                    {moduleData.has_rear_14_pin_sync_output == true ? (
                      <>
                        Rear 14 Pin Header Sync Output
                        <br />
                      </>
                    ) : (
                      ''
                    )}
                  </p>
                </>
              )}
            </div>
            <div className={'basis-[100%] md:basis-1/2'}>
              {moduleData.max_pos_12v_ma > 0 ||
              moduleData.max_neg_12v_ma > 0 ? (
                <>
                  <h3>Power Consumption</h3>
                  <p>
                    {moduleData.max_pos_12v_ma !== 0 ? (
                      <>
                        {'+12V @ ' + moduleData.max_pos_12v_ma + 'mA'}
                        <br />
                      </>
                    ) : (
                      ''
                    )}
                    {moduleData.max_neg_12v_ma !== 0 ? (
                      <>
                        {'-12V @ ' + moduleData.max_neg_12v_ma + 'mA'}
                        <br />
                      </>
                    ) : (
                      ''
                    )}
                  </p>
                </>
              ) : (
                ''
              )}
            </div>
            <div className="basis-[100%] md:basis-1/2">
              {moduleData.has_dc_barrel_power_entry == true ||
              moduleData.has_eurorack_power_entry == true ? (
                <>
                  <h3>Power Entry</h3>
                  <p>
                    {moduleData.has_dc_barrel_power_entry == true ? (
                      <>
                        Rear DC Barrel Jack
                        <br />
                      </>
                    ) : (
                      ''
                    )}
                    {moduleData.has_eurorack_power_entry == true ? (
                      <>
                        Rear EuroRack 16 Pin Header
                        <br />
                      </>
                    ) : (
                      ''
                    )}
                  </p>
                </>
              ) : (
                ''
              )}
            </div>
            {moduleData.connectors.length == 0 &&
            moduleData.controls.length == 0 ? (
              ''
            ) : (
              <div
                className={
                  portraitAspect
                    ? 'basis-[100%] z-0'
                    : 'basis-[100%] xl:basis-1/2 z-0'
                }
              >
                <h3>Legend</h3>
                <ModuleLegendPanel
                  moduleData={moduleData}
                  setActiveRefDes={setActiveRefDes}
                  activeRefDes={activeRefDes}
                  pixelsPerHP={
                    portraitAspect ? (screenWidth < 400 ? 6 : 8) : 20
                  }
                />
              </div>
            )}
            {moduleData.connectors.length == 0 &&
            moduleData.controls.length == 0 ? (
              ''
            ) : portraitAspect == false ? (
              <>
                <div className="basis-[100%] xl:basis-1/2">
                  {moduleData.connectors.length > 0 ? (
                    <h3>Connectors</h3>
                  ) : null}
                  <p>
                    {moduleData.connectors.length > 0
                      ? moduleData.connectors.map((conn, index) => {
                          return (
                            <div
                              key={`${conn.x}-${conn.y}`}
                              className={
                                'flex flex-row cursor-pointer ' +
                                (activeRefDes == conn.refDes
                                  ? ' bg-yellow-500 text-black bg-opacity-100'
                                  : 'bg-black text-primary/50 bg-opacity-0')
                              }
                              onMouseEnter={() => {
                                setActiveRefDes(conn.refDes);
                              }}
                            >
                              <div className="shrink-0 grow-0 w-10">
                                {conn.refDes}
                              </div>
                              <div className="">
                                {conn.name} {conn.is_input ? 'Input' : 'Output'}
                              </div>
                            </div>
                          );
                        })
                      : null}
                  </p>
                  {moduleData.controls.length > 0 ? <h3>Controls</h3> : null}

                  <p>
                    {moduleData.controls.length > 0
                      ? moduleData.controls.map((conn, index) => {
                          return (
                            <div
                              key={`${conn.x}-${conn.y}`}
                              className={
                                'flex flex-row cursor-pointer ' +
                                (activeRefDes == conn.refDes
                                  ? ' bg-yellow-500 text-black bg-opacity-100'
                                  : 'bg-black text-primary/50 bg-opacity-0')
                              }
                              onMouseEnter={() => {
                                setActiveRefDes(conn.refDes);
                              }}
                            >
                              <div className="shrink-0 grow-0 w-10">
                                {conn.refDes}
                              </div>
                              <div className="">{conn.name}</div>
                            </div>
                          );
                        })
                      : null}
                  </p>
                </div>
              </>
            ) : (
              ''
            )}
            {moduleData.connectors.length == 0 &&
            moduleData.controls.length == 0 ? (
              ''
            ) : portraitAspect == true ? (
              <>
                <div className="basis-[100%] xl:basis-1/2">
                  {moduleData.connectors.length > 0 ? (
                    <h3>Connectors</h3>
                  ) : null}
                  <p>
                    {moduleData.connectors.length > 0
                      ? moduleData.connectors.map((conn, index) => {
                          return (
                            <div
                              key={`${conn.x}-${conn.y}`}
                              className={
                                'flex flex-row cursor-pointer ' +
                                (activeRefDes == conn.refDes
                                  ? ' bg-yellow-500 text-black bg-opacity-100'
                                  : 'bg-black text-primary/50 bg-opacity-0')
                              }
                              onMouseEnter={() => {
                                setActiveRefDes(conn.refDes);
                              }}
                            >
                              <div className="shrink-0 grow-0 w-10">
                                {conn.refDes}
                              </div>
                              <div className="">
                                {conn.name} {conn.is_input ? 'Input' : 'Output'}
                              </div>
                            </div>
                          );
                        })
                      : null}
                  </p>
                </div>
                <div className="basis-[100%] xl:basis-1/2">
                  {moduleData.controls.length > 0 ? <h3>Controls</h3> : null}
                  <p>
                    {moduleData.controls.length > 0
                      ? moduleData.controls.map((conn, index) => {
                          return (
                            <div
                              key={`${conn.x}-${conn.y}`}
                              className={
                                'flex flex-row cursor-pointer ' +
                                (activeRefDes == conn.refDes
                                  ? ' bg-yellow-500 text-black bg-opacity-100'
                                  : 'bg-black text-primary/50 bg-opacity-0')
                              }
                              onMouseEnter={() => {
                                setActiveRefDes(conn.refDes);
                              }}
                            >
                              <div className="shrink-0 grow-0 w-10">
                                {conn.refDes}
                              </div>
                              <div className="">{conn.name}</div>
                            </div>
                          );
                        })
                      : null}
                  </p>
                </div>
              </>
            ) : (
              ''
            )}
          </div>

          {moduleData.assets.length > 0 ? (
            <h2>
              <TbRectangleFilled className="inline-block align-middle" />{' '}
              <span className="align-middle">Downloads</span>
            </h2>
          ) : (
            ''
          )}
          <p>
            {moduleData.assets.map((asset) => {
              return (
                <div
                  key={`${moduleData.company}-${moduleData.name}-${asset.name}`}
                >
                  <a
                    target="_blank"
                    href={'/assets/' + asset.file_name}
                    rel="noreferrer"
                  >
                    {asset.name} ({asset.file_type.toUpperCase()})
                  </a>
                  <br />
                </div>
              );
            })}
          </p>

          {hasPatchFeatures ? (
            <h2>
              <TbRectangleFilled className="inline-block align-middle" />{' '}
              <span className="align-middle">Patching Tips</span>
            </h2>
          ) : (
            ''
          )}
          {hasPatchFeatures
            ? moduleData.features.map((feature) => {
                return feature.topic == 'Patch' ? (
                  <div
                    key={`${moduleData.company}-${moduleData.name}-${feature.name}`}
                  >
                    <h3>{feature.name}</h3>
                    <p
                      dangerouslySetInnerHTML={{__html: feature.description}}
                    ></p>
                  </div>
                ) : (
                  ''
                );
              })
            : ''}
          {hasSystemFeatures ? (
            <h2>
              <TbRectangleFilled className="inline-block align-middle" />{' '}
              <span className="align-middle">System Building Tips</span>
            </h2>
          ) : (
            ''
          )}
          {hasSystemFeatures
            ? moduleData.features.map((feature) => {
                return feature.topic == 'System' ? (
                  <div
                    key={`${moduleData.company}-${moduleData.name}-${feature.name}`}
                  >
                    <h3>{feature.name}</h3>
                    <p
                      dangerouslySetInnerHTML={{__html: feature.description}}
                    ></p>
                  </div>
                ) : (
                  ''
                );
              })
            : ''}
        </article>
        <div>
          <h1>Documentation</h1>
          <MarkdownContent
            urls={[
              'https://raw.githubusercontent.com/lzxindustries/lzxdocs/master/blog/2024-05-18-chromagnon-box/index.md',
            ]}
          />
        </div>
      </div>
    </div>
  );
}
