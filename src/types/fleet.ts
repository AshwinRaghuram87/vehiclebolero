export type VehicleModelType = 'Mahindra Bolero' | 'Mahindra Camper';

export type OperationalSite = 'DIOM' | 'KIOM' | 'PPT' | 'Admin Building';

export const OPERATIONAL_SITES: {
  id: OperationalSite;
  name: string;
  shortDesc: string;
  badgeColor: string;
}[] = [
  {
    id: 'DIOM',
    name: 'DIOM (Donimalai Iron Ore Mine)',
    shortDesc: 'Mine pit, benches & heavy vehicle haul roads',
    badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  },
  {
    id: 'KIOM',
    name: 'KIOM (Kumaraswamy Iron Ore Mine)',
    shortDesc: 'Kumaraswamy hilltop mine & operations',
    badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  },
  {
    id: 'PPT',
    name: 'PPT (Pellet Plant / Plant Area)',
    shortDesc: 'Screening plant, conveyor siding & workshop',
    badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  },
  {
    id: 'Admin Building',
    name: 'Stay at Admin Building',
    shortDesc: 'Local duty, administrative complex & town office',
    badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  },
];

export interface Vehicle {
  id: string;
  regNumber: string; // e.g. KA-35-M-4821
  nickName: string; // e.g. Bolero Unit 1
  model: VehicleModelType;
  modelVariant: string; // e.g. Bolero Power+ / Camper Gold VX
  driverName: string;
  driverPhone: string;
  initialOdometer: number; // KM
  currentOdometer: number; // KM
  contractRatePerKm: number; // e.g. ₹15 / km
  monthlyFixedRate: number; // e.g. ₹35,000 / month if hired on monthly basis
  fuelType: 'Diesel';
  status: 'Active' | 'On Trip' | 'Maintenance' | 'Standby';
  color: string;
  tag: string;
}

export type ShiftType = 
  | 'General Shift (09:00 - 18:00)'
  | 'Morning Shift (06:00 - 14:00)'
  | 'Evening Shift (14:00 - 22:00)'
  | 'Night Shift (22:00 - 06:00)'
  | 'Full Day / Multi-Trip'
  | 'Emergency / Special Duty';

export interface TripLog {
  id: string;
  date: string; // YYYY-MM-DD
  vehicleId: string;
  vehicleReg: string;
  vehicleModel: VehicleModelType;
  driverName: string;
  destinationSite: OperationalSite; // DIOM | KIOM | PPT | Admin Building
  routeFrom: string; // default "Sandur"
  routeTo: string; // default "Donimalai"
  viaOrArea?: string; // e.g. "Township", "Mine Top", "Central Workshop", "Ghat Section"
  shift: ShiftType;
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  startKm: number;
  endKm: number;
  totalKm: number;
  purpose: string; // e.g. "Staff Pickup & Drop", "Mining Engineers Site Visit", "Administrative Material Transport"
  officerOrDept?: string; // e.g. "Administration / HR", "Mine Survey Team", "Guest Transit"
  fuelLitres?: number;
  fuelCost?: number;
  tollOrOtherExpenses?: number;
  remarks?: string;
  voucherNumber?: string;
  createdAt: string;
}

export type DatePresetKey = 'today' | 'yesterday' | 'last7days' | 'thisMonth' | 'lastMonth' | 'custom';

export interface DateRangeFilter {
  preset: DatePresetKey;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  vehicleId: string; // 'all' or specific id
  siteFilter?: string; // 'all' | OperationalSite
  routeFilter: string; // 'all' or specific
}

export interface SiteBreakdownItem {
  site: OperationalSite;
  name: string;
  tripCount: number;
  totalKm: number;
  pct: number;
}

export interface VehicleBreakdownItem {
  vehicleId: string;
  regNumber: string;
  model: VehicleModelType;
  nickName: string;
  totalKm: number;
  tripCount: number;
  totalFuelLitres: number;
  percentageOfTotalKm: number;
}

export interface ReportStats {
  totalKm: number;
  totalTrips: number;
  operatingDays: number;
  avgKmPerDay: number;
  avgKmPerTrip: number;
  totalFuelLitres: number;
  totalFuelCost: number;
  totalTollExpenses: number;
  estimatedHireCost: number;
  siteBreakdown: SiteBreakdownItem[];
  vehicleBreakdown: VehicleBreakdownItem[];
}

export const DEFAULT_DIESEL_PRICE = 100.04;

export interface FuelLog {
  id: string;
  date: string; // YYYY-MM-DD
  vehicleId: string;
  vehicleReg: string;
  vehicleModel: VehicleModelType;
  driverName: string;
  odometerAtRefuel: number;
  pricePerLitre: number; // default 100.04
  amountPaid: number; // e.g. 2500 (round figure)
  exactLitres: number; // e.g. 24.99 Litres (amountPaid / pricePerLitre)
  fuelBunk: string; // e.g. "IOCL Bunk, Sandur" or "NMDC Pump Donimalai"
  slipNumber?: string; // voucher / receipt no
  paymentMethod?: string; // e.g. "Cash / Office Card"
  remarks?: string;
  createdAt: string;
}

export interface MonthlyVehicleFuelStat {
  monthKey: string; // e.g. "2026-09"
  monthName: string; // e.g. "September 2026"
  vehicleId: string;
  vehicleReg: string;
  vehicleNickName: string;
  vehicleModel: VehicleModelType;
  totalKmRun: number;
  totalFuelLitres: number;
  totalFuelCost: number;
  refuelCount: number;
  averageMileageKmPerLitre: number;
  costPerKm: number;
}

export interface MonthlyFleetFuelSummary {
  monthKey: string;
  monthName: string;
  totalFleetKm: number;
  totalFleetLitres: number;
  totalFleetFuelCost: number;
  overallFleetMileage: number;
  overallCostPerKm: number;
  vehicleStats: MonthlyVehicleFuelStat[];
}

