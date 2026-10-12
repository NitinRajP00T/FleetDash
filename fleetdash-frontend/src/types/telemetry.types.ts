export interface TelemetryPoint {
  vehicleId: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading?: number;
  altitude?: number;
  distanceKm?: number;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface TelemetryQueryResult {
  results: Array<{
    vehicleId: string;
    bucketHour?: string;
    lastTimestamp?: string;
    latestPoint?: TelemetryPoint;
  }>;
  total: number;
}
