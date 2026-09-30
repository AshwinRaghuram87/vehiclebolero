import {
  Vehicle,
  TripLog,
  FuelLog,
  MonthlyFleetFuelSummary,
  MonthlyVehicleFuelStat,
  DEFAULT_DIESEL_PRICE,
} from '../types/fleet';

/**
 * Calculates exact fuel in litres when user pays a round figure amount.
 * Example: Amount ₹2,500 at ₹100.04/L = 24.99 Litres
 */
export const calculateExactFuelFromAmount = (
  amountPaid: number,
  pricePerLitre: number = DEFAULT_DIESEL_PRICE
): { exactLitres: number; formula: string } => {
  if (!amountPaid || amountPaid <= 0 || !pricePerLitre || pricePerLitre <= 0) {
    return { exactLitres: 0, formula: '₹0 ÷ ₹100.04 = 0.00 L' };
  }

  const rawLitres = amountPaid / pricePerLitre;
  // Standard two decimal precision for fuel dispensers / fuel billing
  const exactLitres = Math.round(rawLitres * 100) / 100;
  const formula = `₹${amountPaid.toLocaleString('en-IN')} ÷ ₹${pricePerLitre.toFixed(2)}/L = ${exactLitres.toFixed(2)} Litres`;

  return { exactLitres, formula };
};

export const calculateCostFromLitres = (
  litres: number,
  pricePerLitre: number = DEFAULT_DIESEL_PRICE
): { exactCost: number; nearestRoundFigures: number[] } => {
  if (!litres || litres <= 0) return { exactCost: 0, nearestRoundFigures: [] };
  const exactCost = Math.round(litres * pricePerLitre * 100) / 100;
  const baseRound = Math.floor(exactCost / 500) * 500;
  const nearestRoundFigures = [baseRound, baseRound + 500, baseRound + 1000].filter((n) => n > 0);
  return { exactCost, nearestRoundFigures };
};

const formatMonthName = (monthKey: string): string => {
  try {
    const [y, m] = monthKey.split('-');
    const date = new Date(parseInt(y), parseInt(m) - 1, 1);
    return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  } catch {
    return monthKey;
  }
};

/**
 * Aggregates fuel consumption and costs on a monthly basis for each vehicle.
 */
export const aggregateMonthlyFuelData = (
  fuelLogs: FuelLog[],
  trips: TripLog[],
  vehicles: Vehicle[]
): MonthlyFleetFuelSummary[] => {
  // Collect all distinct YYYY-MM month keys
  const monthKeysSet = new Set<string>();

  fuelLogs.forEach((f) => {
    if (f.date && f.date.length >= 7) {
      monthKeysSet.add(f.date.slice(0, 7));
    }
  });

  trips.forEach((t) => {
    if (t.date && t.date.length >= 7) {
      monthKeysSet.add(t.date.slice(0, 7));
    }
  });

  // Ensure current month is present
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  monthKeysSet.add(currentMonthKey);

  const sortedMonthKeys = Array.from(monthKeysSet).sort((a, b) => b.localeCompare(a));

  return sortedMonthKeys.map((mKey) => {
    const monthTrips = trips.filter((t) => t.date.startsWith(mKey));
    const monthFuelLogs = fuelLogs.filter((f) => f.date.startsWith(mKey));

    // Vehicle statistics for this month
    const vehicleStats: MonthlyVehicleFuelStat[] = vehicles.map((v) => {
      const vTrips = monthTrips.filter((t) => t.vehicleId === v.id);
      const vFuelLogs = monthFuelLogs.filter((f) => f.vehicleId === v.id);

      const totalKmRun = vTrips.reduce((acc, t) => acc + (t.totalKm || 0), 0);

      // Fuel from dedicated fuel logs + any fuel logged directly in trips
      const dedicatedLitres = vFuelLogs.reduce((acc, f) => acc + (f.exactLitres || 0), 0);
      const dedicatedCost = vFuelLogs.reduce((acc, f) => acc + (f.amountPaid || 0), 0);

      // If fuel was also logged directly in trip logs without a matching refuel log id:
      const tripLitresOnly = vTrips.reduce((acc, t) => acc + (t.fuelLitres || 0), 0);
      const tripCostOnly = vTrips.reduce((acc, t) => acc + (t.fuelCost || 0), 0);

      // Use whichever is greater or combined to ensure no data is lost
      const totalFuelLitres = Math.max(dedicatedLitres, tripLitresOnly);
      const totalFuelCost = Math.max(dedicatedCost, tripCostOnly);

      const refuelCount = Math.max(
        vFuelLogs.length,
        vTrips.filter((t) => (t.fuelLitres || 0) > 0).length
      );

      const averageMileageKmPerLitre =
        totalFuelLitres > 0 ? Math.round((totalKmRun / totalFuelLitres) * 100) / 100 : 0;

      const costPerKm =
        totalKmRun > 0 ? Math.round((totalFuelCost / totalKmRun) * 100) / 100 : 0;

      return {
        monthKey: mKey,
        monthName: formatMonthName(mKey),
        vehicleId: v.id,
        vehicleReg: v.regNumber,
        vehicleNickName: v.nickName,
        vehicleModel: v.model,
        totalKmRun,
        totalFuelLitres: Math.round(totalFuelLitres * 100) / 100,
        totalFuelCost,
        refuelCount,
        averageMileageKmPerLitre,
        costPerKm,
      };
    });

    const totalFleetKm = vehicleStats.reduce((acc, vs) => acc + vs.totalKmRun, 0);
    const totalFleetLitres =
      Math.round(vehicleStats.reduce((acc, vs) => acc + vs.totalFuelLitres, 0) * 100) / 100;
    const totalFleetFuelCost = vehicleStats.reduce((acc, vs) => acc + vs.totalFuelCost, 0);

    const overallFleetMileage =
      totalFleetLitres > 0 ? Math.round((totalFleetKm / totalFleetLitres) * 100) / 100 : 0;
    const overallCostPerKm =
      totalFleetKm > 0 ? Math.round((totalFleetFuelCost / totalFleetKm) * 100) / 100 : 0;

    return {
      monthKey: mKey,
      monthName: formatMonthName(mKey),
      totalFleetKm,
      totalFleetLitres,
      totalFleetFuelCost,
      overallFleetMileage,
      overallCostPerKm,
      vehicleStats,
    };
  });
};

export const exportMonthlyFuelCSV = (summaries: MonthlyFleetFuelSummary[]): void => {
  const headers = [
    'Month',
    'Vehicle Name',
    'Registration',
    'Model',
    'Total KM Run',
    'Refuels Count',
    'Total Diesel Filled (Litres)',
    'Total Fuel Cost (INR)',
    'Average Mileage (KM/L)',
    'Cost per KM (INR/KM)',
  ];

  const rows: any[][] = [];

  summaries.forEach((month) => {
    month.vehicleStats.forEach((v) => {
      rows.push([
        `"${month.monthName}"`,
        `"${v.vehicleNickName}"`,
        `"${v.vehicleReg}"`,
        `"${v.vehicleModel}"`,
        v.totalKmRun,
        v.refuelCount,
        v.totalFuelLitres,
        v.totalFuelCost,
        v.averageMileageKmPerLitre,
        v.costPerKm,
      ]);
    });

    // Add Month Fleet Total Row
    rows.push([
      `"${month.monthName} (FLEET TOTAL)"`,
      '"All 3 Vehicles"',
      '"Combined"',
      '"Fleet"',
      month.totalFleetKm,
      month.vehicleStats.reduce((a, b) => a + b.refuelCount, 0),
      month.totalFleetLitres,
      month.totalFleetFuelCost,
      month.overallFleetMileage,
      month.overallCostPerKm,
    ]);
  });

  const csvContent =
    'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'Sandur_Donimalai_Monthly_Fuel_Report.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
