import type {AppLoadContext} from '@shopify/remix-oxygen';
import {getDataCollection} from '~/lib/db.server';
import type {CompanyInterface} from '~/models/company';
import type {ModuleInterface} from '~/models/module';
import type {ModuleView} from '~/views/module';

export async function getAllModules(context: AppLoadContext) {
  const module_datas = (await getDataCollection(context, 'Module', [
    {$limit: 1024},
    {$sort: {is_active_product: -1}},
  ])) as ModuleInterface[];
  const company_datas = (await getDataCollection(
    context,
    'Company',
  )) as CompanyInterface[];
  const module_views: ModuleView[] = [];

  module_datas.forEach((module_data) => {
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
      has_eurorack_power_sync_output:
        module_data.has_eurorack_power_sync_output,
      has_rear_14_pin_sync_input: module_data.has_rear_14_pin_sync_input,
      has_rear_14_pin_sync_output: module_data.has_rear_14_pin_sync_output,
      is_sync_generator: module_data.is_sync_generator,
      external_url: module_data.external_url,
      is_active_product: module_data.is_active_product,
      is_oem_product: module_data.is_oem_product,
      in_stock_count: module_data.in_stock_count,
      company: {
        name: 'Unknown',
        legalName: 'Unknown',
      },
      connectors: [],
      features: [],
      controls: [],
      assets: [],
      videos: [],
    };

    company_datas.forEach((company_data) => {
      if (module_data.company == company_data._id)
        module_view.company.name = company_data.name;
      if (module_data.company == company_data._id)
        module_view.company.legalName = company_data.legalName;
    });
    module_views.push(module_view);
  });
  return module_views;
}
