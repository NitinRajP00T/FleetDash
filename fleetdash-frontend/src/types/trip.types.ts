export type TripStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface TripTimelineEvent {
  type: string;
  message: string;
  timestamp: string;
}

export interface TripRoutePoint {
  lat: number;
  lon: number;
  timestamp?: string;
}

export interface Trip {
  _id: string;
  tripNumber?: string;
  title?: string;
  description?: string;
  status: TripStatus;
  driver?: {
    _id: string;
    name?: string;
  } | string | null;
  vehicle?: {
    _id: string;
    make?: string;
    vehicleModel?: string;
    licensePlate?: string;
  } | string | null;
  startTime?: string;
  endTime?: string;
  route?: TripRoutePoint[];
  timeline?: TripTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTripPayload {
  title: string;
  description?: string;
  driverId?: string;
  vehicleId?: string;
  startTime?: string;
}
