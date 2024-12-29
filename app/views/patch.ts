import type {ArtistView} from './artist';
import type {PatchModuleView} from './patch_module';
import type {PatchVideoView} from './patch_video';

export type PatchView = {
  notes: string;
  name: string;
  diagram: string;
  youtube: string;
  artist: ArtistView;
  gif: string;
  videos: PatchVideoView[];
  modules: PatchModuleView[];
};
