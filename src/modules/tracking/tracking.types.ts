export interface UpdateDriverLocationDTO {
  orderId: string;
  latitude: number;
  longitude: number;
  heading?: number | null;
  speed?: number | null;
  accuracy?: number | null;
}

export interface DriverLocationResponse {
  orderId: string;
  driverId: string;
  latitude: number;
  longitude: number;
  heading?: number | null;
  speed?: number | null;
  accuracy?: number | null;
  isActive: boolean;
  updatedAt: Date;
}