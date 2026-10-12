export type DriverStatus = 'on_duty' | 'off_duty' | 'driving' | 'break';

export interface Driver {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  licenseNumber?: string;
  status: DriverStatus;
  assignedVehicle?: {
    _id: string;
    make?: string;
    vehicleModel?: string;
    licensePlate?: string;
  } | string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDriverPayload {
  name: string;
  email: string;
  phone?: string;
  licenseNumber?: string;
  status?: DriverStatus;
  assignedVehicle?: string | null;
}

export interface UpdateDriverPayload extends Partial<CreateDriverPayload> {}
