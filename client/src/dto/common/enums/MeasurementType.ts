/**
 * Measurement type constants
 */
export const MEASUREMENT_TYPES = [
  'Select a Measurement Type',
  'Frequency',
  'Duration',
  'Rate'
] as const;

export type MeasurementType = typeof MEASUREMENT_TYPES[number];
