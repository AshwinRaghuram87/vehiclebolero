import { Vehicle, TripLog, FuelLog, DEFAULT_DIESEL_PRICE } from '../types/fleet';

const VEHICLES_STORAGE_KEY = 'sandur_donimalai_vehicles_v1';
const TRIPS_STORAGE_KEY = 'sandur_donimalai_trips_v1';
const FUEL_STORAGE_KEY = 'sandur_donimalai_fuel_logs_v1';

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh-bolero-1',
    regNumber: 'KA-35-M-4821',
    nickName: 'Bolero Unit 1 (Shift Staff)',
    model: 'Mahindra Bolero',
    modelVariant: 'Bolero Power+ ZLX (7-Seater)',
    driverName: 'Basavaraj K.',
    driverPhone: '+91 94481 23411',
    initialOdometer: 54100,
    currentOdometer: 54980,
    contractRatePerKm: 15,
    monthlyFixedRate: 38000,
    fuelType: 'Diesel',
    status: 'Active',
    color: '#0284c7', // Sky Blue
    tag: 'Staff Transport',
  },
  {
    id: 'veh-bolero-2',
    regNumber: 'KA-35-M-9014',
    nickName: 'Bolero Unit 2 (Office / Inspection)',
    model: 'Mahindra Bolero',
    modelVariant: 'Bolero B6 Opt (White)',
    driverName: 'Manjunath S.',
    driverPhone: '+91 98450 78219',
    initialOdometer: 48200,
    currentOdometer: 48944,
    contractRatePerKm: 15,
    monthlyFixedRate: 38000,
    fuelType: 'Diesel',
    status: 'Active',
    color: '#10b981', // Emerald
    tag: 'Office Inspection',
  },
  {
    id: 'veh-camper-1',
    regNumber: 'KA-35-TR-2350',
    nickName: 'Mahindra Camper (Utility & Crew)',
    model: 'Mahindra Camper',
    modelVariant: 'Bolero Maxi Truck / Camper Gold Double Cab',
    driverName: 'Ramesh Naik',
    driverPhone: '+91 97312 44520',
    initialOdometer: 39150,
    currentOdometer: 39860,
    contractRatePerKm: 17,
    monthlyFixedRate: 42000,
    fuelType: 'Diesel',
    status: 'Active',
    color: '#f59e0b', // Amber
    tag: 'Material & Field Crew',
  },
];

// Generate realistic sample trip logs leading up to 2026-09-29
export const generateSampleTrips = (): TripLog[] => {
  const sampleTrips: any[] = [
    // 2026-09-29 (Today)
    {
      id: 'trip-20260929-1',
      date: '2026-09-29',
      vehicleId: 'veh-bolero-1',
      vehicleReg: 'KA-35-M-4821',
      vehicleModel: 'Mahindra Bolero',
      driverName: 'Basavaraj K.',
      destinationSite: 'Admin Building',
      routeFrom: 'Sandur Head Office',
      routeTo: 'Donimalai Admin Building',
      viaOrArea: 'Administrative Block & Sector 1',
      shift: 'Morning Shift (06:00 - 14:00)',
      startTime: '06:15',
      endTime: '08:45',
      startKm: 54944,
      endKm: 54980,
      totalKm: 36,
      purpose: 'Morning Shift Executives & Operations Staff Transit',
      officerOrDept: 'Operations & HR Team',
      fuelLitres: 0,
      fuelCost: 0,
      tollOrOtherExpenses: 0,
      remarks: 'Smooth trip, return pickup scheduled for 14:00',
      voucherNumber: 'LOG-2026-0929-01',
      createdAt: '2026-09-29T08:50:00Z',
    },
    {
      id: 'trip-20260929-2',
      date: '2026-09-29',
      vehicleId: 'veh-camper-1',
      vehicleReg: 'KA-35-TR-2350',
      vehicleModel: 'Mahindra Camper',
      driverName: 'Ramesh Naik',
      destinationSite: 'DIOM',
      routeFrom: 'Sandur Store Depot',
      routeTo: 'DIOM (Donimalai Iron Ore Mine)',
      viaOrArea: 'Benches & Pit Top Siding',
      shift: 'General Shift (09:00 - 18:00)',
      startTime: '09:00',
      endTime: '12:30',
      startKm: 39812,
      endKm: 39860,
      totalKm: 48,
      purpose: 'Drill bits, lubricants & maintenance crew transit',
      officerOrDept: 'Mechanical Maintenance Dept',
      fuelLitres: 25,
      fuelCost: 2350,
      tollOrOtherExpenses: 0,
      remarks: 'Material dispatched and safely unloaded at Hilltop Siding',
      voucherNumber: 'LOG-2026-0929-02',
      createdAt: '2026-09-29T12:35:00Z',
    },

    // 2026-09-28 (Yesterday)
    {
      id: 'trip-20260928-1',
      date: '2026-09-28',
      vehicleId: 'veh-bolero-1',
      vehicleReg: 'KA-35-M-4821',
      vehicleModel: 'Mahindra Bolero',
      driverName: 'Basavaraj K.',
      destinationSite: 'Admin Building',
      routeFrom: 'Sandur Office',
      routeTo: 'Stay at Admin Building',
      viaOrArea: 'Admin Complex & Township Round Trip',
      shift: 'Full Day / Multi-Trip',
      startTime: '07:00',
      endTime: '17:30',
      startKm: 54870,
      endKm: 54944,
      totalKm: 74,
      purpose: 'Regular staff 2-way commute and midday courier duty',
      officerOrDept: 'Transport & Admin',
      fuelLitres: 0,
      fuelCost: 0,
      tollOrOtherExpenses: 50,
      remarks: 'Two complete round trips done',
      voucherNumber: 'LOG-2026-0928-01',
      createdAt: '2026-09-28T18:00:00Z',
    },
    {
      id: 'trip-20260928-2',
      date: '2026-09-28',
      vehicleId: 'veh-bolero-2',
      vehicleReg: 'KA-35-M-9014',
      vehicleModel: 'Mahindra Bolero',
      driverName: 'Manjunath S.',
      destinationSite: 'KIOM',
      routeFrom: 'Sandur Town Office',
      routeTo: 'KIOM (Kumaraswamy Iron Ore Mine)',
      viaOrArea: 'Ghat Section & Central Weighbridge',
      shift: 'General Shift (09:00 - 18:00)',
      startTime: '09:15',
      endTime: '16:45',
      startKm: 48902,
      endKm: 48944,
      totalKm: 42,
      purpose: 'Senior Geologist & Inspection Officer Site Visit',
      officerOrDept: 'Geology & Survey Dept',
      fuelLitres: 0,
      fuelCost: 0,
      tollOrOtherExpenses: 0,
      remarks: 'Site inspection completed on time',
      voucherNumber: 'LOG-2026-0928-02',
      createdAt: '2026-09-28T17:00:00Z',
    },

    // 2026-09-27
    {
      id: 'trip-20260927-1',
      date: '2026-09-27',
      vehicleId: 'veh-bolero-2',
      vehicleReg: 'KA-35-M-9014',
      vehicleModel: 'Mahindra Bolero',
      driverName: 'Manjunath S.',
      destinationSite: 'Admin Building',
      routeFrom: 'Sandur Office',
      routeTo: 'Donimalai Guest House & Admin',
      viaOrArea: 'VIP Transit & Sector 2',
      shift: 'General Shift (09:00 - 18:00)',
      startTime: '08:30',
      endTime: '15:00',
      startKm: 48866,
      endKm: 48902,
      totalKm: 36,
      purpose: 'Corporate Auditors pickup and transit to Guest House',
      officerOrDept: 'Internal Audit Wing',
      fuelLitres: 0,
      fuelCost: 0,
      tollOrOtherExpenses: 0,
      remarks: 'Official auditor travel',
      voucherNumber: 'LOG-2026-0927-01',
      createdAt: '2026-09-27T15:30:00Z',
    },
    {
      id: 'trip-20260927-2',
      date: '2026-09-27',
      vehicleId: 'veh-camper-1',
      vehicleReg: 'KA-35-TR-2350',
      vehicleModel: 'Mahindra Camper',
      driverName: 'Ramesh Naik',
      destinationSite: 'PPT',
      routeFrom: 'Sandur Depot',
      routeTo: 'PPT (Pellet Plant / Plant Area)',
      viaOrArea: 'Conveyor Loading Area & Screening',
      shift: 'General Shift (09:00 - 18:00)',
      startTime: '10:00',
      endTime: '16:00',
      startKm: 39760,
      endKm: 39812,
      totalKm: 52,
      purpose: 'Conveyor belt spares and electrical testing tools',
      officerOrDept: 'Electrical Plant Wing',
      fuelLitres: 0,
      fuelCost: 0,
      tollOrOtherExpenses: 0,
      remarks: 'Delivered to plant supervisor',
      voucherNumber: 'LOG-2026-0927-02',
      createdAt: '2026-09-27T16:15:00Z',
    },

    // 2026-09-26
    {
      id: 'trip-20260926-1',
      date: '2026-09-26',
      vehicleId: 'veh-bolero-1',
      vehicleReg: 'KA-35-M-4821',
      vehicleModel: 'Mahindra Bolero',
      driverName: 'Basavaraj K.',
      routeFrom: 'Sandur Office',
      routeTo: 'Donimalai Township',
      viaOrArea: 'Standard Commute',
      shift: 'Morning Shift (06:00 - 14:00)',
      startTime: '06:00',
      endTime: '14:30',
      startKm: 54800,
      endKm: 54870,
      totalKm: 70,
      purpose: 'Staff morning and afternoon shift rotation',
      officerOrDept: 'HR & Admin',
      fuelLitres: 35,
      fuelCost: 3290,
      tollOrOtherExpenses: 0,
      remarks: 'Diesel filled at Sandur IOCL bunk',
      voucherNumber: 'LOG-2026-0926-01',
      createdAt: '2026-09-26T14:45:00Z',
    },

    // 2026-09-25
    {
      id: 'trip-20260925-1',
      date: '2026-09-25',
      vehicleId: 'veh-bolero-2',
      vehicleReg: 'KA-35-M-9014',
      vehicleModel: 'Mahindra Bolero',
      driverName: 'Manjunath S.',
      routeFrom: 'Sandur Office',
      routeTo: 'Donimalai Central Workshop',
      viaOrArea: 'Equipment Yard',
      shift: 'General Shift (09:00 - 18:00)',
      startTime: '09:00',
      endTime: '17:00',
      startKm: 48828,
      endKm: 48866,
      totalKm: 38,
      purpose: 'Safety audit committee inspection trip',
      officerOrDept: 'Safety & Environment Wing',
      fuelLitres: 0,
      fuelCost: 0,
      tollOrOtherExpenses: 0,
      remarks: 'Safety audit signed by committee head',
      voucherNumber: 'LOG-2026-0925-01',
      createdAt: '2026-09-25T17:10:00Z',
    },
    {
      id: 'trip-20260925-2',
      date: '2026-09-25',
      vehicleId: 'veh-camper-1',
      vehicleReg: 'KA-35-TR-2350',
      vehicleModel: 'Mahindra Camper',
      driverName: 'Ramesh Naik',
      routeFrom: 'Sandur Store',
      routeTo: 'Donimalai Mine Top',
      viaOrArea: 'Drilling Camp 3',
      shift: 'Morning Shift (06:00 - 14:00)',
      startTime: '07:30',
      endTime: '13:00',
      startKm: 39715,
      endKm: 39760,
      totalKm: 45,
      purpose: 'Drill rig accessories & survey instruments',
      officerOrDept: 'Exploration Cell',
      fuelLitres: 0,
      fuelCost: 0,
      tollOrOtherExpenses: 0,
      remarks: 'Delivered safely',
      voucherNumber: 'LOG-2026-0925-02',
      createdAt: '2026-09-25T13:20:00Z',
    },

    // 2026-09-24
    {
      id: 'trip-20260924-1',
      date: '2026-09-24',
      vehicleId: 'veh-bolero-1',
      vehicleReg: 'KA-35-M-4821',
      vehicleModel: 'Mahindra Bolero',
      driverName: 'Basavaraj K.',
      routeFrom: 'Sandur Office',
      routeTo: 'Donimalai Township',
      viaOrArea: 'Double Round Trip',
      shift: 'Full Day / Multi-Trip',
      startTime: '06:30',
      endTime: '18:00',
      startKm: 54728,
      endKm: 54800,
      totalKm: 72,
      purpose: 'Daily office personnel transit morning & evening',
      officerOrDept: 'Personnel & Welfare',
      fuelLitres: 0,
      fuelCost: 0,
      tollOrOtherExpenses: 0,
      remarks: 'All 7 seats utilized',
      voucherNumber: 'LOG-2026-0924-01',
      createdAt: '2026-09-24T18:15:00Z',
    },
    {
      id: 'trip-20260924-2',
      date: '2026-09-24',
      vehicleId: 'veh-bolero-2',
      vehicleReg: 'KA-35-M-9014',
      vehicleModel: 'Mahindra Bolero',
      driverName: 'Manjunath S.',
      routeFrom: 'Sandur Office',
      routeTo: 'Donimalai Mining Area',
      viaOrArea: 'Bench 4 & Weighbridge',
      shift: 'General Shift (09:00 - 18:00)',
      startTime: '09:00',
      endTime: '15:30',
      startKm: 48788,
      endKm: 48828,
      totalKm: 40,
      purpose: 'Survey of mining boundary markers',
      officerOrDept: 'Survey Dept',
      fuelLitres: 30,
      fuelCost: 2820,
      tollOrOtherExpenses: 0,
      remarks: 'Fuel filled in Sandur',
      voucherNumber: 'LOG-2026-0924-02',
      createdAt: '2026-09-24T15:45:00Z',
    },

    // 2026-09-22
    {
      id: 'trip-20260922-1',
      date: '2026-09-22',
      vehicleId: 'veh-bolero-1',
      vehicleReg: 'KA-35-M-4821',
      vehicleModel: 'Mahindra Bolero',
      driverName: 'Basavaraj K.',
      routeFrom: 'Sandur Office',
      routeTo: 'Donimalai Township',
      viaOrArea: 'Township & Hospital',
      shift: 'Morning Shift (06:00 - 14:00)',
      startTime: '06:00',
      endTime: '14:00',
      startKm: 54660,
      endKm: 54728,
      totalKm: 68,
      purpose: 'Staff transit and medical dispatch',
      officerOrDept: 'Administration',
      fuelLitres: 0,
      fuelCost: 0,
      tollOrOtherExpenses: 0,
      remarks: 'Regular schedule',
      voucherNumber: 'LOG-2026-0922-01',
      createdAt: '2026-09-22T14:15:00Z',
    },
    {
      id: 'trip-20260922-2',
      date: '2026-09-22',
      vehicleId: 'veh-camper-1',
      vehicleReg: 'KA-35-TR-2350',
      vehicleModel: 'Mahindra Camper',
      driverName: 'Ramesh Naik',
      routeFrom: 'Sandur Depot',
      routeTo: 'Donimalai Railway Siding',
      viaOrArea: 'Wagon Loading Yard',
      shift: 'General Shift (09:00 - 18:00)',
      startTime: '08:45',
      endTime: '16:30',
      startKm: 39660,
      endKm: 39715,
      totalKm: 55,
      purpose: 'Siding staff & mechanical spares transport',
      officerOrDept: 'Logistics & Dispatch',
      fuelLitres: 0,
      fuelCost: 0,
      tollOrOtherExpenses: 0,
      remarks: 'Returned to Sandur Depot by 16:30',
      voucherNumber: 'LOG-2026-0922-02',
      createdAt: '2026-09-22T16:45:00Z',
    },

    // 2026-09-20
    {
      id: 'trip-20260920-1',
      date: '2026-09-20',
      vehicleId: 'veh-bolero-2',
      vehicleReg: 'KA-35-M-9014',
      vehicleModel: 'Mahindra Bolero',
      driverName: 'Manjunath S.',
      routeFrom: 'Sandur Office',
      routeTo: 'Donimalai Township',
      viaOrArea: 'Guest House & Township',
      shift: 'General Shift (09:00 - 18:00)',
      startTime: '09:00',
      endTime: '15:00',
      startKm: 48750,
      endKm: 48788,
      totalKm: 38,
      purpose: 'Head Office executive visit',
      officerOrDept: 'Management Committee',
      fuelLitres: 0,
      fuelCost: 0,
      tollOrOtherExpenses: 0,
      remarks: 'Smooth operation',
      voucherNumber: 'LOG-2026-0920-01',
      createdAt: '2026-09-20T15:15:00Z',
    },
    {
      id: 'trip-20260920-2',
      date: '2026-09-20',
      vehicleId: 'veh-camper-1',
      vehicleReg: 'KA-35-TR-2350',
      vehicleModel: 'Mahindra Camper',
      driverName: 'Ramesh Naik',
      routeFrom: 'Sandur Store',
      routeTo: 'Donimalai Plant Area',
      viaOrArea: 'Screening Plant & Workshop',
      shift: 'General Shift (09:00 - 18:00)',
      startTime: '08:30',
      endTime: '17:00',
      startKm: 39600,
      endKm: 39660,
      totalKm: 60,
      purpose: 'Conveyor roller replacements and hydraulic fluid drums',
      officerOrDept: 'Crushing & Screening Plant',
      fuelLitres: 40,
      fuelCost: 3760,
      tollOrOtherExpenses: 0,
      remarks: 'Heavy load, delivered without issues',
      voucherNumber: 'LOG-2026-0920-02',
      createdAt: '2026-09-20T17:15:00Z',
    },

    // 2026-09-18
    {
      id: 'trip-20260918-1',
      date: '2026-09-18',
      vehicleId: 'veh-bolero-1',
      vehicleReg: 'KA-35-M-4821',
      vehicleModel: 'Mahindra Bolero',
      driverName: 'Basavaraj K.',
      routeFrom: 'Sandur Office',
      routeTo: 'Donimalai Township',
      viaOrArea: 'Daily Commute',
      shift: 'Morning Shift (06:00 - 14:00)',
      startTime: '06:00',
      endTime: '14:15',
      startKm: 54590,
      endKm: 54660,
      totalKm: 70,
      purpose: 'Staff rotation commute',
      officerOrDept: 'Admin & Operations',
      fuelLitres: 0,
      fuelCost: 0,
      tollOrOtherExpenses: 0,
      remarks: 'Normal run',
      voucherNumber: 'LOG-2026-0918-01',
      createdAt: '2026-09-18T14:30:00Z',
    },
    {
      id: 'trip-20260918-2',
      date: '2026-09-18',
      vehicleId: 'veh-bolero-2',
      vehicleReg: 'KA-35-M-9014',
      vehicleModel: 'Mahindra Bolero',
      driverName: 'Manjunath S.',
      routeFrom: 'Sandur Office',
      routeTo: 'Donimalai Mine Office',
      viaOrArea: 'Safety Post',
      shift: 'General Shift (09:00 - 18:00)',
      startTime: '09:00',
      endTime: '16:00',
      startKm: 48712,
      endKm: 48750,
      totalKm: 38,
      purpose: 'Environmental testing water samples transport',
      officerOrDept: 'Environment Cell',
      fuelLitres: 0,
      fuelCost: 0,
      tollOrOtherExpenses: 0,
      remarks: 'Samples safely delivered',
      voucherNumber: 'LOG-2026-0918-02',
      createdAt: '2026-09-18T16:15:00Z',
    },

    // 2026-09-15
    {
      id: 'trip-20260915-1',
      date: '2026-09-15',
      vehicleId: 'veh-bolero-1',
      vehicleReg: 'KA-35-M-4821',
      vehicleModel: 'Mahindra Bolero',
      driverName: 'Basavaraj K.',
      routeFrom: 'Sandur Office',
      routeTo: 'Donimalai Township',
      viaOrArea: 'Township Round Trip',
      shift: 'Full Day / Multi-Trip',
      startTime: '06:15',
      endTime: '17:30',
      startKm: 54518,
      endKm: 54590,
      totalKm: 72,
      purpose: 'Bi-weekly administrative files and staff transit',
      officerOrDept: 'Accounts & Administration',
      fuelLitres: 32,
      fuelCost: 3008,
      tollOrOtherExpenses: 0,
      remarks: 'Diesel filled at Sandur Bunk',
      voucherNumber: 'LOG-2026-0915-01',
      createdAt: '2026-09-15T18:00:00Z',
    },
    {
      id: 'trip-20260915-2',
      date: '2026-09-15',
      vehicleId: 'veh-camper-1',
      vehicleReg: 'KA-35-TR-2350',
      vehicleModel: 'Mahindra Camper',
      driverName: 'Ramesh Naik',
      routeFrom: 'Sandur Depot',
      routeTo: 'Donimalai Hilltop Siding',
      viaOrArea: 'Ghat Section',
      shift: 'General Shift (09:00 - 18:00)',
      startTime: '08:30',
      endTime: '16:00',
      startKm: 39540,
      endKm: 39600,
      totalKm: 60,
      purpose: 'Field crew tools, PPE kits, and lubricants transport',
      officerOrDept: 'Mine Operations Team',
      fuelLitres: 0,
      fuelCost: 0,
      tollOrOtherExpenses: 0,
      remarks: 'Delivered',
      voucherNumber: 'LOG-2026-0915-02',
      createdAt: '2026-09-15T16:20:00Z',
    },

    // 2026-09-10
    {
      id: 'trip-20260910-1',
      date: '2026-09-10',
      vehicleId: 'veh-bolero-1',
      vehicleReg: 'KA-35-M-4821',
      vehicleModel: 'Mahindra Bolero',
      driverName: 'Basavaraj K.',
      routeFrom: 'Sandur Office',
      routeTo: 'Donimalai Township',
      viaOrArea: 'Township Routine',
      shift: 'Morning Shift (06:00 - 14:00)',
      startTime: '06:00',
      endTime: '14:30',
      startKm: 54448,
      endKm: 54518,
      totalKm: 70,
      purpose: 'Regular shift staff commute',
      officerOrDept: 'Shift Staff',
      fuelLitres: 0,
      fuelCost: 0,
      tollOrOtherExpenses: 0,
      remarks: 'Clean run',
      voucherNumber: 'LOG-2026-0910-01',
      createdAt: '2026-09-10T14:45:00Z',
    },
    {
      id: 'trip-20260910-2',
      date: '2026-09-10',
      vehicleId: 'veh-bolero-2',
      vehicleReg: 'KA-35-M-9014',
      vehicleModel: 'Mahindra Bolero',
      driverName: 'Manjunath S.',
      routeFrom: 'Sandur Office',
      routeTo: 'Donimalai Guest House',
      viaOrArea: 'Mine Inspection Road',
      shift: 'General Shift (09:00 - 18:00)',
      startTime: '09:00',
      endTime: '15:30',
      startKm: 48670,
      endKm: 48712,
      totalKm: 42,
      purpose: 'Technical inspection team transit',
      officerOrDept: 'Technical Services',
      fuelLitres: 28,
      fuelCost: 2632,
      tollOrOtherExpenses: 0,
      remarks: 'Diesel filled',
      voucherNumber: 'LOG-2026-0910-02',
      createdAt: '2026-09-10T15:45:00Z',
    },

    // 2026-09-05
    {
      id: 'trip-20260905-1',
      date: '2026-09-05',
      vehicleId: 'veh-bolero-1',
      vehicleReg: 'KA-35-M-4821',
      vehicleModel: 'Mahindra Bolero',
      driverName: 'Basavaraj K.',
      routeFrom: 'Sandur Office',
      routeTo: 'Donimalai Township',
      viaOrArea: 'Staff Transit',
      shift: 'Morning Shift (06:00 - 14:00)',
      startTime: '06:00',
      endTime: '14:00',
      startKm: 54378,
      endKm: 54448,
      totalKm: 70,
      purpose: 'Staff pickup and drop',
      officerOrDept: 'HR Wing',
      fuelLitres: 34,
      fuelCost: 3196,
      tollOrOtherExpenses: 0,
      remarks: 'Routine run',
      voucherNumber: 'LOG-2026-0905-01',
      createdAt: '2026-09-05T14:15:00Z',
    },
    {
      id: 'trip-20260905-2',
      date: '2026-09-05',
      vehicleId: 'veh-camper-1',
      vehicleReg: 'KA-35-TR-2350',
      vehicleModel: 'Mahindra Camper',
      driverName: 'Ramesh Naik',
      routeFrom: 'Sandur Depot',
      routeTo: 'Donimalai Mine Top',
      viaOrArea: 'Workshop & Crusher 2',
      shift: 'General Shift (09:00 - 18:00)',
      startTime: '08:00',
      endTime: '16:00',
      startKm: 39480,
      endKm: 39540,
      totalKm: 60,
      purpose: 'Camp utility tools, diesel pump spares delivery',
      officerOrDept: 'Plant Engineering',
      fuelLitres: 35,
      fuelCost: 3290,
      tollOrOtherExpenses: 0,
      remarks: 'Unloaded and verified by engineer',
      voucherNumber: 'LOG-2026-0905-02',
      createdAt: '2026-09-05T16:15:00Z',
    },

    // 2026-09-01
    {
      id: 'trip-20260901-1',
      date: '2026-09-01',
      vehicleId: 'veh-bolero-1',
      vehicleReg: 'KA-35-M-4821',
      vehicleModel: 'Mahindra Bolero',
      driverName: 'Basavaraj K.',
      routeFrom: 'Sandur Office',
      routeTo: 'Donimalai Township',
      viaOrArea: 'Beginning of month dispatch',
      shift: 'Morning Shift (06:00 - 14:00)',
      startTime: '06:30',
      endTime: '14:30',
      startKm: 54310,
      endKm: 54378,
      totalKm: 68,
      purpose: 'Monthly shift staffing transit & payroll dispatches',
      officerOrDept: 'Administration & Finance',
      fuelLitres: 0,
      fuelCost: 0,
      tollOrOtherExpenses: 0,
      remarks: 'Start of monthly contract logs',
      voucherNumber: 'LOG-2026-0901-01',
      createdAt: '2026-09-01T15:00:00Z',
    },
    {
      id: 'trip-20260901-2',
      date: '2026-09-01',
      vehicleId: 'veh-bolero-2',
      vehicleReg: 'KA-35-M-9014',
      vehicleModel: 'Mahindra Bolero',
      driverName: 'Manjunath S.',
      routeFrom: 'Sandur Office',
      routeTo: 'Donimalai Mine Office',
      viaOrArea: 'Safety & Environmental Post',
      shift: 'General Shift (09:00 - 18:00)',
      startTime: '09:00',
      endTime: '15:30',
      startKm: 48630,
      endKm: 48670,
      totalKm: 40,
      purpose: 'Monthly planning coordination meeting',
      officerOrDept: 'Planning & Project Dept',
      fuelLitres: 0,
      fuelCost: 0,
      tollOrOtherExpenses: 0,
      remarks: 'Officials attended monthly review',
      voucherNumber: 'LOG-2026-0901-02',
      createdAt: '2026-09-01T16:00:00Z',
    }
  ];

  return sanitizeTrips(sampleTrips).sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
};

export const getStoredVehicles = (): Vehicle[] => {
  try {
    const raw = localStorage.getItem(VEHICLES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(INITIAL_VEHICLES));
      return INITIAL_VEHICLES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_VEHICLES;
  } catch (err) {
    console.error('Failed to load vehicles from storage:', err);
    return INITIAL_VEHICLES;
  }
};

export const saveStoredVehicles = (vehicles: Vehicle[]): void => {
  try {
    localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(vehicles));
  } catch (err) {
    console.error('Failed to save vehicles to storage:', err);
  }
};

export const getStoredTripLogs = (): TripLog[] => {
  try {
    const raw = localStorage.getItem(TRIPS_STORAGE_KEY);
    if (!raw) {
      const initial = sanitizeTrips(generateSampleTrips());
      localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return sanitizeTrips(parsed);
    }
    return sanitizeTrips(generateSampleTrips());
  } catch (err) {
    console.error('Failed to load trip logs from storage:', err);
    return sanitizeTrips(generateSampleTrips());
  }
};

const sanitizeTrips = (list: any[]): TripLog[] => {
  return list.map((t) => {
    let site: any = t.destinationSite;
    if (!site || !['DIOM', 'KIOM', 'PPT', 'Admin Building'].includes(site)) {
      const text = `${t.routeTo || ''} ${t.viaOrArea || ''} ${t.purpose || ''}`.toLowerCase();
      if (text.includes('kumaraswamy') || text.includes('kiom') || text.includes('survey')) {
        site = 'KIOM';
      } else if (text.includes('mine') || text.includes('diom') || text.includes('drill') || text.includes('bench')) {
        site = 'DIOM';
      } else if (text.includes('plant') || text.includes('ppt') || text.includes('workshop') || text.includes('siding') || text.includes('conveyor')) {
        site = 'PPT';
      } else {
        site = 'Admin Building';
      }
    }
    return {
      ...t,
      destinationSite: site,
    };
  });
};

export const saveStoredTripLogs = (trips: TripLog[]): void => {
  try {
    localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(trips));
  } catch (err) {
    console.error('Failed to save trip logs to storage:', err);
  }
};

export const updateVehicleOdometer = (vehicleId: string, newEndKm: number): void => {
  const vehicles = getStoredVehicles();
  const updated = vehicles.map(v => {
    if (v.id === vehicleId && newEndKm > v.currentOdometer) {
      return { ...v, currentOdometer: newEndKm };
    }
    return v;
  });
  saveStoredVehicles(updated);
};

export const generateSampleFuelLogs = (): FuelLog[] => {
  return [
    {
      id: 'fuel-20260929-1',
      date: '2026-09-29',
      vehicleId: 'veh-camper-1',
      vehicleReg: 'KA-35-TR-2350',
      vehicleModel: 'Mahindra Camper',
      driverName: 'Ramesh Naik',
      odometerAtRefuel: 39812,
      pricePerLitre: DEFAULT_DIESEL_PRICE,
      amountPaid: 2500, // Round figure paid
      exactLitres: 24.99, // 2500 / 100.04
      fuelBunk: 'IOCL Fuel Station, Sandur Main Road',
      slipNumber: 'IOCL-SD-9481',
      paymentMethod: 'Office Corporate Fuel Card',
      remarks: 'Filled prior to mine top heavy delivery trip',
      createdAt: '2026-09-29T08:50:00Z',
    },
    {
      id: 'fuel-20260926-1',
      date: '2026-09-26',
      vehicleId: 'veh-bolero-1',
      vehicleReg: 'KA-35-M-4821',
      vehicleModel: 'Mahindra Bolero',
      driverName: 'Basavaraj K.',
      odometerAtRefuel: 54800,
      pricePerLitre: DEFAULT_DIESEL_PRICE,
      amountPaid: 3500, // Round figure paid
      exactLitres: 34.99, // 3500 / 100.04
      fuelBunk: 'HPCL Station, Sandur Town',
      slipNumber: 'HPCL-SND-1044',
      paymentMethod: 'Office Cash Voucher',
      remarks: 'Staff shift transport full tank refill',
      createdAt: '2026-09-26T14:30:00Z',
    },
    {
      id: 'fuel-20260924-1',
      date: '2026-09-24',
      vehicleId: 'veh-bolero-2',
      vehicleReg: 'KA-35-M-9014',
      vehicleModel: 'Mahindra Bolero',
      driverName: 'Manjunath S.',
      odometerAtRefuel: 48788,
      pricePerLitre: DEFAULT_DIESEL_PRICE,
      amountPaid: 3000, // Round figure paid
      exactLitres: 29.99, // 3000 / 100.04
      fuelBunk: 'IOCL Fuel Station, Sandur',
      slipNumber: 'IOCL-SD-9012',
      paymentMethod: 'Office Corporate Fuel Card',
      remarks: 'Inspection trip refuel',
      createdAt: '2026-09-24T15:20:00Z',
    },
    {
      id: 'fuel-20260920-1',
      date: '2026-09-20',
      vehicleId: 'veh-camper-1',
      vehicleReg: 'KA-35-TR-2350',
      vehicleModel: 'Mahindra Camper',
      driverName: 'Ramesh Naik',
      odometerAtRefuel: 39600,
      pricePerLitre: DEFAULT_DIESEL_PRICE,
      amountPaid: 4000, // Round figure paid
      exactLitres: 39.98, // 4000 / 100.04
      fuelBunk: 'NMDC Consumer Pump, Donimalai',
      slipNumber: 'NMDC-FL-4402',
      paymentMethod: 'Office Indent Voucher',
      remarks: 'Refill for plant maintenance transit',
      createdAt: '2026-09-20T16:50:00Z',
    },
    {
      id: 'fuel-20260915-1',
      date: '2026-09-15',
      vehicleId: 'veh-bolero-1',
      vehicleReg: 'KA-35-M-4821',
      vehicleModel: 'Mahindra Bolero',
      driverName: 'Basavaraj K.',
      odometerAtRefuel: 54518,
      pricePerLitre: DEFAULT_DIESEL_PRICE,
      amountPaid: 3200, // Round figure paid
      exactLitres: 31.99, // 3200 / 100.04
      fuelBunk: 'IOCL Station, Sandur',
      slipNumber: 'IOCL-SD-8871',
      paymentMethod: 'Office Cash Voucher',
      remarks: 'Routine mid-month refill',
      createdAt: '2026-09-15T17:40:00Z',
    },
    {
      id: 'fuel-20260910-1',
      date: '2026-09-10',
      vehicleId: 'veh-bolero-2',
      vehicleReg: 'KA-35-M-9014',
      vehicleModel: 'Mahindra Bolero',
      driverName: 'Manjunath S.',
      odometerAtRefuel: 48670,
      pricePerLitre: DEFAULT_DIESEL_PRICE,
      amountPaid: 2800, // Round figure paid
      exactLitres: 27.99, // 2800 / 100.04
      fuelBunk: 'HPCL Station, Sandur',
      slipNumber: 'HPCL-SND-0914',
      paymentMethod: 'Office Corporate Card',
      remarks: 'Refill before auditor visit',
      createdAt: '2026-09-10T15:20:00Z',
    },
    {
      id: 'fuel-20260905-1',
      date: '2026-09-05',
      vehicleId: 'veh-bolero-1',
      vehicleReg: 'KA-35-M-4821',
      vehicleModel: 'Mahindra Bolero',
      driverName: 'Basavaraj K.',
      odometerAtRefuel: 54378,
      pricePerLitre: DEFAULT_DIESEL_PRICE,
      amountPaid: 3400, // Round figure paid
      exactLitres: 33.99, // 3400 / 100.04
      fuelBunk: 'IOCL Bunk, Sandur',
      slipNumber: 'IOCL-SD-8520',
      paymentMethod: 'Office Cash Voucher',
      remarks: 'Beginning of month shift duty refill',
      createdAt: '2026-09-05T13:50:00Z',
    },
    {
      id: 'fuel-20260905-2',
      date: '2026-09-05',
      vehicleId: 'veh-camper-1',
      vehicleReg: 'KA-35-TR-2350',
      vehicleModel: 'Mahindra Camper',
      driverName: 'Ramesh Naik',
      odometerAtRefuel: 39480,
      pricePerLitre: DEFAULT_DIESEL_PRICE,
      amountPaid: 3500, // Round figure paid
      exactLitres: 34.99, // 3500 / 100.04
      fuelBunk: 'NMDC Pump, Donimalai',
      slipNumber: 'NMDC-FL-4211',
      paymentMethod: 'Office Indent Voucher',
      remarks: 'Full tank for machinery logistics',
      createdAt: '2026-09-05T15:30:00Z',
    },
    // August 2026 records for previous month comparison
    {
      id: 'fuel-20260828-1',
      date: '2026-08-28',
      vehicleId: 'veh-bolero-1',
      vehicleReg: 'KA-35-M-4821',
      vehicleModel: 'Mahindra Bolero',
      driverName: 'Basavaraj K.',
      odometerAtRefuel: 54150,
      pricePerLitre: DEFAULT_DIESEL_PRICE,
      amountPaid: 3500,
      exactLitres: 34.99,
      fuelBunk: 'IOCL Fuel Station, Sandur',
      slipNumber: 'IOCL-AUG-781',
      paymentMethod: 'Office Corporate Fuel Card',
      remarks: 'August month end fuel',
      createdAt: '2026-08-28T14:00:00Z',
    },
    {
      id: 'fuel-20260825-1',
      date: '2026-08-25',
      vehicleId: 'veh-bolero-2',
      vehicleReg: 'KA-35-M-9014',
      vehicleModel: 'Mahindra Bolero',
      driverName: 'Manjunath S.',
      odometerAtRefuel: 48050,
      pricePerLitre: DEFAULT_DIESEL_PRICE,
      amountPaid: 3000,
      exactLitres: 29.99,
      fuelBunk: 'HPCL Station, Sandur',
      slipNumber: 'HPCL-AUG-412',
      paymentMethod: 'Office Cash Voucher',
      remarks: 'August general shift fuel',
      createdAt: '2026-08-25T16:00:00Z',
    },
    {
      id: 'fuel-20260820-1',
      date: '2026-08-20',
      vehicleId: 'veh-camper-1',
      vehicleReg: 'KA-35-TR-2350',
      vehicleModel: 'Mahindra Camper',
      driverName: 'Ramesh Naik',
      odometerAtRefuel: 39020,
      pricePerLitre: DEFAULT_DIESEL_PRICE,
      amountPaid: 4000,
      exactLitres: 39.98,
      fuelBunk: 'NMDC Consumer Pump, Donimalai',
      slipNumber: 'NMDC-AUG-991',
      paymentMethod: 'Office Indent Voucher',
      remarks: 'August utility truck refuel',
      createdAt: '2026-08-20T15:00:00Z',
    },
  ];
};

export const getStoredFuelLogs = (): FuelLog[] => {
  try {
    const raw = localStorage.getItem(FUEL_STORAGE_KEY);
    if (!raw) {
      const initial = generateSampleFuelLogs();
      localStorage.setItem(FUEL_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return generateSampleFuelLogs();
  } catch (err) {
    console.error('Failed to load fuel logs from storage:', err);
    return generateSampleFuelLogs();
  }
};

export const saveStoredFuelLogs = (logs: FuelLog[]): void => {
  try {
    localStorage.setItem(FUEL_STORAGE_KEY, JSON.stringify(logs));
  } catch (err) {
    console.error('Failed to save fuel logs to storage:', err);
  }
};

export const resetAllData = (): { vehicles: Vehicle[]; trips: TripLog[]; fuelLogs: FuelLog[] } => {
  localStorage.removeItem(VEHICLES_STORAGE_KEY);
  localStorage.removeItem(TRIPS_STORAGE_KEY);
  localStorage.removeItem(FUEL_STORAGE_KEY);
  const vehicles = INITIAL_VEHICLES;
  const trips = generateSampleTrips();
  const fuelLogs = generateSampleFuelLogs();
  localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(vehicles));
  localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(trips));
  localStorage.setItem(FUEL_STORAGE_KEY, JSON.stringify(fuelLogs));
  return { vehicles, trips, fuelLogs };
};
