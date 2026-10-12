import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Truck, Gauge, Compass } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { useVehicleStore } from '../store/useVehicleStore';
import { useTelemetryStore } from '../store/useTelemetryStore';
import { formatSpeed, formatHeading } from '../utils/formatters';

// Fix default Leaflet marker icon issue in React
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export const LiveMapPage: React.FC = () => {
  const { vehicles, fetchVehicles } = useVehicleStore();
  const { latestMap } = useTelemetryStore();

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Center around San Francisco / default coordinates
  const defaultCenter: [number, number] = [37.7749, -122.4194];

  return (
    <div className="space-y-4 h-[calc(100vh-140px)] flex flex-col">
      {/* Map Header Info Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            Fleet Live GPS Map
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Real-time Leaflet map visualization for active fleet vehicles and telemetry markers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="active">
            {vehicles.length} Vehicles Tracked
          </Badge>
        </div>
      </div>

      {/* Leaflet Map Canvas Container */}
      <Card className="flex-1 p-0 overflow-hidden relative border border-gray-200 dark:border-dark-800 shadow-md">
        <MapContainer
          center={defaultCenter}
          zoom={12}
          scrollWheelZoom={true}
          className="w-full h-full min-h-[450px] z-10"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {vehicles.map((v) => {
            const liveTelemetry = latestMap[v._id];
            const lat = liveTelemetry?.latitude || v.lastLocation?.lat || 37.7749 + (Math.random() - 0.5) * 0.1;
            const lon = liveTelemetry?.longitude || v.lastLocation?.lon || -122.4194 + (Math.random() - 0.5) * 0.1;

            return (
              <Marker key={v._id} position={[lat, lon]} icon={defaultIcon}>
                <Popup>
                  <div className="p-2 space-y-2 min-w-[200px]">
                    <div className="flex items-center justify-between border-b pb-1">
                      <span className="font-bold text-sm text-gray-900">
                        {v.make} {v.vehicleModel}
                      </span>
                      <span className="text-xs font-mono font-semibold text-brand-600">
                        {v.licensePlate || 'N/A'}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Gauge className="w-3.5 h-3.5 text-emerald-500" /> Speed:
                        </span>
                        <span className="font-bold text-gray-900">
                          {formatSpeed(liveTelemetry?.speed || 45)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Compass className="w-3.5 h-3.5 text-blue-500" /> Heading:
                        </span>
                        <span>{formatHeading(liveTelemetry?.heading || 180)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5 text-gray-400" /> Status:
                        </span>
                        <span className="capitalize font-semibold">{v.status}</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </Card>
    </div>
  );
};
