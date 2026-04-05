type ParamKeyValuePair = [string, string];
type ParamValue = string | number | boolean | string[] | number[] | undefined | null;
type QueryConfig = Record<string, ParamValue>;

export const createSearchParams = (init: QueryConfig): URLSearchParams => {
  const entries: ParamKeyValuePair[] = Object.entries(init).reduce((acc, [key, value]) => {
    if (value === undefined || value === null || value === '') return acc;

    if (Array.isArray(value)) {
      if (value.length > 0) {
        acc.push([key, value.join(',')]);
      }
    } else {
      acc.push([key, String(value)]);
    }
    return acc;
  }, [] as ParamKeyValuePair[]);

  return new URLSearchParams(entries);
};

export const normalizePath = (path: string): string => {

  return path.replace(/\/:[^/]+/g, '/[^/]+');
};
