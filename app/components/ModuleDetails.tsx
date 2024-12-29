import {useState} from 'react';
import {BsFillArrowRightSquareFill} from 'react-icons/bs';
import {FaArrowRight} from 'react-icons/fa';
import {
  TbRectangleFilled,
  TbTriangleFilled,
  TbTriangleInvertedFilled,
  TbCircleFilled,
} from 'react-icons/tb';
import {ModuleLegendPanel} from './ModuleLegendPanel';
import {AddToCartButton} from '.';
import type {ModuleView} from '~/views/module';

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

  return (
    <div key="ModuleDetails" className="flex flex-wrap flex-row justify-center">
      <div className="basis-[100%] md:basis-1/2 card-image flex flex-wrap flex-row justify-center">
        {portraitAspect ? (
          <div className="px-8 py-4">
            <img
              style={{width: 'auto', height: 'auto'}}
              src={'/images/' + moduleData.frontpanel}
              alt={`${moduleData.name} front panel`}
            />
          </div>
        ) : (
          <div className="px-8 py-4">
            <img
              className="w-auto max-h-[80vh]"
              src={'/images/' + moduleData.frontpanel}
              alt={`${moduleData.name} front panel`}
            />
          </div>
        )}
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
                  pixelsPerHP={portraitAspect ? 8 : 20}
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
                              key={`${moduleData.name}-${conn.part}-${conn.name}-${conn.refDes}-${index}`}
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
                              key={`${moduleData.name}-${conn.name}-${conn.refDes}-${index}`}
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
                              key={`${moduleData.name}-${conn.name}-${conn.refDes}-${index}`}
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
                              key={`${moduleData.name}-${conn.name}-${conn.refDes}-${index}`}
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

          {moduleData.videos.length > 0 ? (
            <h2>
              <TbRectangleFilled className="inline-block align-middle" />{' '}
              <span className="align-middle">Videos</span>
            </h2>
          ) : (
            ''
          )}
          {moduleData.videos.map((video) => {
            return video.youtube ? (
              <iframe
                key={video.name}
                className="basis-[100%] aspect-video w-full"
                src={'https://www.youtube.com/embed/' + video.youtube}
                title={video.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              ></iframe>
            ) : null;
          })}

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
      </div>
    </div>
  );
}
