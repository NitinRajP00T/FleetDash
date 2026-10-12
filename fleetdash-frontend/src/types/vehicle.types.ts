export type VehicleStatus = 'active' | 'inactive' | 'maintenance';

export interface Vehicle {
  _id: string;
  vin?: string;
  make?: string;
  vehicleModel?: string;
  year?: number;
  licensePlate?: string;
  status: VehicleStatus;
  assignedDriver?: {
    _id: string;
    name?: string;
    email?: string;
  } | string | null;
  lastLocation?: {
    lat: number;
    lon: number;
    timestamp: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehiclePayload {
  vin?: string;
  make?: string;
  vehicleModel?: string;
  year?: number;
  licensePlate?: string;
  status?: VehicleStatus;
}

export interface UpdateVehiclePayload extends Partial<CreateVehiclePayload> {}
