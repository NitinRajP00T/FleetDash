export interface DashboardKPIs {
  vehicles: {
    total: number;
    active: number;
    inactive: number;
    maintenance: number;
  };
  trips: {
    total: number;
    scheduled: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    todayTotal: number;
  };
  alerts: {
    total: number;
    active: number;
    critical: number;
    todayTotal: number;
  };
  drivers: {
    total: number;
  };
}

export interface LiveSummary {
  vehiclesOnline: number;
  tripsInProgress: number;
  activeAlerts: number;
  criticalAlerts: number;
  generatedAt: string;
}

export interface DashboardOverview {
  kpis: DashboardKPIs;
  recentAlerts: {
    alerts: Array<any>;
    total: number;
  };
  recentTrips: {
    trips: Array<any>;
    total: number;
  };
  liveSummary: LiveSummary;
}
