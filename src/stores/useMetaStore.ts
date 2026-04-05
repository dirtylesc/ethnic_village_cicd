import { create } from 'zustand';

import { Ethnic } from '@/types/ethnic.type';
import { Location } from '@/types/location.type';

type MetaState = {
  ethnics: Ethnic[];
  locations: Location[];
  setEthnics: (ethnics: Ethnic[]) => void;
  setLocations: (locations: Location[]) => void;
}

export const useMetaStore = create<MetaState>(set => ({
  ethnics: [],
  locations: [],
  setEthnics: ethnics => set({ ethnics }),
  setLocations: locations => set({ locations }),
}));
