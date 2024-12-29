import type {AppLoadContext} from '@shopify/remix-oxygen';
import {getDataCollection, getDataDocument} from '~/lib/db.server';
import type {AssetInterface} from '~/models/asset';
import type {CompanyInterface} from '~/models/company';
import type {ModuleInterface} from '~/models/module';
import type {ModuleAssetInterface} from '~/models/module_asset';
import type {ModuleConnectorInterface} from '~/models/module_connector';
import type {ModuleControlInterface} from '~/models/module_control';
import type {ModuleFeatureInterface} from '~/models/module_feature';
import type {ModuleVideoInterface} from '~/models/module_video';
import type {PartInterface} from '~/models/part';
import type {VideoInterface} from '~/models/video';
import type {ModuleView} from '~/views/module';
import type {ModulePartView} from '~/views/module_part';

export async function getModuleDetails(context: AppLoadContext, id: string) {
  const filters = {id};
  const module_data = (await getDataDocument(
    context,
    'Module',
    filters,
  )) as ModuleInterface;
  const company_data = (await getDataCollection(
    context,
    'Company',
  )) as CompanyInterface[];
  const module_videos_data = (await getDataCollection(
    context,
    'ModuleVideo',
  )) as ModuleVideoInterface[];
  const module_assets_data = (await getDataCollection(
    context,
    'ModuleAsset',
  )) as ModuleAssetInterface[];
  const videos_data = (await getDataCollection(
    context,
    'Video',
  )) as VideoInterface[];
  // const controls_data = await getDataCollection(context, "ModuleControl", [{ $limit: 1024 }, { $sort: { "refDes": 1 } }]) as ModuleControlInterface[]
  // const connectors_data = await getDataCollection(context, "ModuleConnector", [{ $limit: 1024 }, { $sort: { "refDes": 1 } }]) as ModuleConnectorInterface[]
  const controls_data = (await getDataCollection(context, 'ModuleControl', [
    {$limit: 1024},
  ])) as ModuleControlInterface[];
  const connectors_data = (await getDataCollection(context, 'ModuleConnector', [
    {$limit: 1024},
  ])) as ModuleConnectorInterface[];
  const features_data = (await getDataCollection(
    context,
    'ModuleFeature',
  )) as ModuleFeatureInterface[];
  const parts_data = (await getDataCollection(
    context,
    'Part',
  )) as PartInterface[];
  const assets_data = (await getDataCollection(
    context,
    'Asset',
  )) as AssetInterface[];

  const module_view: ModuleView = {
    id: module_data.id,
    name: module_data.name,
    description: module_data.description,
    has_eurorack_power_entry: module_data.has_eurorack_power_entry,
    has_rear_video_sync_input: module_data.has_rear_video_sync_input,
    has_rear_video_sync_output: module_data.has_rear_video_sync_output,
    hp: module_data.hp,
    is_sync_ref_required: module_data.is_sync_ref_required,
    max_neg_12v_ma: module_data.max_neg_12v_ma,
    max_pos_12v_ma: module_data.max_pos_12v_ma,
    mounting_depth_mm: module_data.mounting_depth_mm,
    subtitle: module_data.subtitle,
    frontpanel: module_data.frontpanel,
    legend: module_data.legend,
    has_front_video_sync_output: module_data.has_front_video_sync_output,
    has_front_video_sync_input: module_data.has_front_video_sync_input,
    is_hidden: module_data.is_hidden,
    has_dc_barrel_power_entry: module_data.has_dc_barrel_power_entry,
    has_eurorack_power_sync_input: module_data.has_eurorack_power_sync_input,
    has_eurorack_power_sync_output: module_data.has_eurorack_power_sync_output,
    has_rear_14_pin_sync_input: module_data.has_rear_14_pin_sync_input,
    has_rear_14_pin_sync_output: module_data.has_rear_14_pin_sync_output,
    is_sync_generator: module_data.is_sync_generator,
    is_active_product: module_data.is_active_product,
    is_oem_product: module_data.is_oem_product,
    in_stock_count: module_data.in_stock_count,
    external_url: module_data.external_url,
    company: {
      name: 'Unknown',
      legalName: 'Unknown',
    },
    connectors: [],
    features: [],
    controls: [],
    videos: [],
    assets: [],
  };

  company_data.forEach((company) => {
    if (module_data.company == company._id)
      module_view.company.name = company.name;
    if (module_data.company == company._id)
      module_view.company.legalName = company.legalName;
  });

  // connectors
  connectors_data.forEach((connector) => {
    const part_view: ModulePartView = {
      name: 'Unknown',
      image: 'None',
    };

    parts_data.forEach((part) => {
      if (connector.part == part._id) part_view.name = part.name;
      if (connector.part == part._id) part_view.image = part.image;
    });

    if (connector.module == module_data._id)
      module_view.connectors.push({
        is_input: connector.is_input,
        is_output: connector.is_output,
        name: connector.name,
        refDes: connector.refDes,
        x: connector.x,
        y: connector.y,
        part: part_view,
      });
  });

  controls_data.forEach((control) => {
    const part_view: ModulePartView = {
      name: 'Unknown',
      image: 'None',
    };

    parts_data.forEach((part) => {
      if (control.part == part._id) part_view.name = part.name;
      if (control.part == part._id) part_view.image = part.image;
    });

    if (control.module == module_data._id)
      module_view.controls.push({
        is_gain: control.is_gain,
        is_bias: control.is_bias,
        name: control.name,
        refDes: control.refDes,
        x: control.x,
        y: control.y,
        part: part_view,
      });
  });

  // features
  features_data.forEach((feature) => {
    if (feature.module == module_data._id)
      module_view.features.push({
        name: feature.name,
        description: feature.description,
        topic: feature.topic,
      });
  });

  // videos
  module_videos_data.forEach((module_video) => {
    if (module_video.module == module_data._id)
      videos_data.forEach((video) => {
        if (video._id == module_video.video)
          module_view.videos.push({
            name: video.name,
            youtube: video.youtube,
            gif: video.gif,
          });
      });
  });

  // assets
  module_assets_data.forEach((module_asset) => {
    if (module_asset.module == module_data._id)
      assets_data.forEach((asset) => {
        if (asset._id == module_asset.asset)
          module_view.assets.push({
            name: asset.name,
            file_name: asset.file_name,
            file_type: asset.file_type,
          });
      });
  });

  return module_view;
}
