export type Order = { 
  id: number;
  orderId: string;
  valueRs: number;
  deliveryTimeMinutes: number;
  deliveredAt: string;
  driverId?: number;
  routeId?: number;
  driver?: { id: number; name: string } | null;
  route?: { id: number; routeId: string } | null;
};
