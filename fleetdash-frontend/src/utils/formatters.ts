/**
 * Formats a date string or object into a human-readable string.
 */
export const formatDate = (dateInput?: string | Date | number | null): string => {
  if (!dateInput) return 'N/A';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return 'N/A';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(d);
};

/**
 * Formats speed in km/h.
 */
export const formatSpeed = (speed?: number | null): string => {
  if (speed === undefined || speed === null) return '0 km/h';
  return `${Math.round(speed)} km/h`;
};

/**
 * Formats distance in km.
 */
export const formatDistance = (distanceKm?: number | null): string => {
  if (distanceKm === undefined || distanceKm === null) return '0.00 km';
  return `${Number(distanceKm).toFixed(2)} km`;
};

/**
 * Formats heading angle in degrees (e.g. 180° S).
 */
export const formatHeading = (heading?: number | null): string => {
  if (heading === undefined || heading === null) return '0° N';
  const deg = Math.round(heading % 360);
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(deg / 45) % 8;
  return `${deg}° ${directions[index]}`;
};

/**
 * Capitalizes string and replaces underscores with spaces.
 */
export const formatStatus = (status?: string | null): string => {
  if (!status) return 'Unknown';
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};
