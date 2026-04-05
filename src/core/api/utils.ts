export function encodeQueryData(data: Record<string, string | number | boolean | null | undefined>): string {
  const params = new URLSearchParams();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });

  return params.toString();
}
