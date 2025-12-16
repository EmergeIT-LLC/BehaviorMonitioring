/**
 * Date range options for graphs
 */
export const DATE_RANGES = [
  { label: 'Last 7 Days', value: 7 },
  { label: 'Last 2 Weeks', value: 14 },
  { label: 'Last Month', value: 30 },
  { label: 'Last 3 Months', value: 90 },
  { label: 'Last 6 Months', value: 180 },
  { label: 'Last 9 Months', value: 270 },
  { label: 'Last Year', value: 365 }
] as const;

export type DateRangeOption = typeof DATE_RANGES[number];
export type DateRangeValue = DateRangeOption['value'];
