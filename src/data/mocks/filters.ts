export type FilterItem = {
  label: string;
  value: string;
  apiValue?:
    | {
        min?: number;
        max?: number;
      }
    | string
    | number
    | boolean;
  id?: string;
};

export type FilterConfig = {
  titleKey: string;
  name: string;
  items: FilterItem[];
  maxVisible: number;
  isMultiSelect?: boolean;
  isTranslated?: boolean;
};

export const FILTERS: Record<string, FilterConfig> = {
  ethnic: {
    titleKey: 'filters.ethnic.title',
    name: 'e',
    items: [],
    maxVisible: 4,
  },
  location: {
    titleKey: 'filters.location.title',
    name: 'l',
    items: [],
    maxVisible: 5,
  },
  tags: {
    titleKey: 'filters.tags.title',
    name: 't',
    items: [],
    maxVisible: 5,
  },
  popular: {
    titleKey: 'filters.popular.title',
    name: 'p',
    items: [
      { label: 'filters.popular.on_sale', value: 'on_sale', apiValue: true },

    ],
    maxVisible: 4,
  },
  duration: {
    titleKey: 'filters.duration.title',
    name: 'd',
    items: [
      {
        label: 'filters.duration.1_day',
        value: 'duration_eq_1',
        apiValue: { min: 1, max: 1 },
      },
      {
        label: 'filters.duration.2_3_days',
        value: 'duration_between_2_3',
        apiValue: { min: 2, max: 3 },
      },
      {
        label: 'filters.duration.4_7_days',
        value: 'duration_between_4_7',
        apiValue: { min: 4, max: 7 },
      },
      {
        label: 'filters.duration.7_plus_days',
        value: 'duration_gte_7',
        apiValue: { min: 7 },
      },
    ],
    maxVisible: 4,
    isMultiSelect: false,
  },
  rating: {
    titleKey: 'filters.rating.title',
    name: 'r',
    items: [
      { label: 'filters.rating.5_stars', value: 'rating_eq_5', apiValue: 5 },
      { label: 'filters.rating.4_stars_up', value: 'rating_gte_4', apiValue: 4 },
      { label: 'filters.rating.3_stars_up', value: 'rating_gte_3', apiValue: 3 },
    ],
    maxVisible: 3,
    isMultiSelect: false,
  },
};
