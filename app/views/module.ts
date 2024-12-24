import type {ModuleConnectorView} from './module_connector';
import type {ModuleControlView} from './module_control';
import type {ModuleFeatureView} from './module_feature';
import type {CompanyView} from './company';
import type {ModuleVideoView} from './module_video';
import type {ModuleAssetView} from './module_asset';

export type ModuleView = {
  id: string;
  name: string;
  description: string;
  company: CompanyView;
  has_eurorack_power_entry: boolean;
  has_rear_video_sync_input: boolean;
  has_rear_video_sync_output: boolean;
  hp: number;
  is_sync_ref_required: boolean;
  max_neg_12v_ma: number;
  max_pos_12v_ma: number;
  mounting_depth_mm: number;
  subtitle: string;
  frontpanel: string;
  legend: string;
  has_front_video_sync_output: boolean;
  has_front_video_sync_input: boolean;
  is_hidden: boolean;
  has_dc_barrel_power_entry: boolean;
  has_eurorack_power_sync_input: boolean;
  has_eurorack_power_sync_output: boolean;
  has_rear_14_pin_sync_input: boolean;
  has_rear_14_pin_sync_output: boolean;
  is_sync_generator: boolean;
  external_url: string;
  is_active_product: boolean;
  is_oem_product: boolean;
  in_stock_count: number;
  connectors: Array<ModuleConnectorView>;
  controls: Array<ModuleControlView>;
  features: Array<ModuleFeatureView>;
  videos: Array<ModuleVideoView>;
  assets: Array<ModuleAssetView>;
};
