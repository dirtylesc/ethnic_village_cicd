import { create } from 'zustand';

import type { EmployeeBasicResponse } from '@/types/employee.type';

export type AssignedGuideByDate = {
  [dateId: string]: EmployeeBasicResponse | null;
}

export type TourAssignments = {
  [tourId: string]: AssignedGuideByDate;
}

type TourAssignmentStore = {

  tourAssignments: TourAssignments;
  activeTourId: string | null;

  setActiveTourId: (tourId: string | null) => void;
  setTourAssignments: (tourId: string, assignments: AssignedGuideByDate) => void;
  updateTourAssignments: (tourId: string, newAssignments: AssignedGuideByDate) => void;
  clearTourAssignments: (tourId?: string) => void;
}

export const useTourAssignmentStore = create<TourAssignmentStore>(set => ({

  tourAssignments: {},
  activeTourId: null,

  setActiveTourId: tourId => set({ activeTourId: tourId }),

  setTourAssignments: (tourId, assignments) =>
    set(state => ({
      tourAssignments: {
        ...state.tourAssignments,
        [tourId]: assignments,
      },
    })),

  updateTourAssignments: (tourId, newAssignments) =>
    set(state => ({
      tourAssignments: {
        ...state.tourAssignments,
        [tourId]: {
          ...(state.tourAssignments[tourId] || {}),
          ...newAssignments,
        },
      },
    })),

  clearTourAssignments: tourId =>
    set(state => {
      if (tourId) {
        const newTourAssignments = { ...state.tourAssignments };
        delete newTourAssignments[tourId];
        return { tourAssignments: newTourAssignments };
      } else {
        return { tourAssignments: {} };
      }
    }),
}));
