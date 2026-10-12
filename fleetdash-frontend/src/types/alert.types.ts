export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AlertStatus = 'active' | 'read' | 'resolved';
export type AlertType =
  | 'speeding'
  | 'geofence_breach'
  | 'harsh_braking'
  | 'harsh_acceleration'
  | 'idle_timeout'
  | 'low_fuel'
  | 'maintenance_due'
  | 'engine_fault'
  | 'panic'
  | 'custom';

export interface Alert {
  _id: string;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  message: string;
  vehicle?: {
    _id: string;
    vin?: string;
    licensePlate?: string;
    make?: string;
  } | string | null;
  driver?: {
    _id: string;
    name?: string;
  } | string | null;
  readAt?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  createdAt: string;
  updatedAt: string;
}
