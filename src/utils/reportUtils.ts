import { TripLog, Vehicle, ReportStats, DateRangeFilter } from '../types/fleet';
import { isDateInRange } from './dateUtils';

export const calculateReportStats = (
  trips: TripLog[],
  vehicles: Vehicle[],
  filter: DateRangeFilter
): { filteredTrips: TripLog[]; stats: ReportStats } => {
  // Filter by date range, vehicle, and operational site
  const filteredTrips = trips.filter((trip) => {
    const inDate = isDateInRange(trip.date, filter.startDate, filter.endDate);
    if (!inDate) return false;
    if (filter.vehicleId !== 'all' && trip.vehicleId !== filter.vehicleId) {
      return false;
    }
    if (filter.siteFilter && filter.siteFilter !== 'all' && trip.destinationSite !== filter.siteFilter) {
      return false;
    }
    if (filter.routeFilter !== 'all' && !trip.routeTo.toLowerCase().includes(filter.routeFilter.toLowerCase())) {
      return false;
    }
    return true;
  });

  const totalKm = filteredTrips.reduce((acc, t) => acc + (t.totalKm || 0), 0);
  const totalTrips = filteredTrips.length;
  
  const distinctDays = new Set(filteredTrips.map((t) => t.date));
  const operatingDays = distinctDays.size;
  const avgKmPerDay = operatingDays > 0 ? Math.round((totalKm / operatingDays) * 10) / 10 : 0;
  const avgKmPerTrip = totalTrips > 0 ? Math.round((totalKm / totalTrips) * 10) / 10 : 0;

  const totalFuelLitres = filteredTrips.reduce((acc, t) => acc + (t.fuelLitres || 0), 0);
  const totalFuelCost = filteredTrips.reduce((acc, t) => acc + (t.fuelCost || 0), 0);
  const totalTollExpenses = filteredTrips.reduce((acc, t) => acc + (t.tollOrOtherExpenses || 0), 0);

  // Calculate estimated hire cost based on vehicle rates
  let estimatedHireCost = 0;
  filteredTrips.forEach((t) => {
    const v = vehicles.find((veh) => veh.id === t.vehicleId);
    const rate = v?.contractRatePerKm || 15;
    estimatedHireCost += (t.totalKm || 0) * rate;
  });

  // Operational Site breakdown (DIOM, KIOM, PPT, Admin Building)
  const siteList: { site: any; name: string }[] = [
    { site: 'DIOM', name: 'DIOM (Donimalai Mine)' },
    { site: 'KIOM', name: 'KIOM (Kumaraswamy Mine)' },
    { site: 'PPT', name: 'PPT (Pellet Plant)' },
    { site: 'Admin Building', name: 'Stay at Admin Building' },
  ];

  const siteBreakdown = siteList.map((s) => {
    const sTrips = filteredTrips.filter((t) => t.destinationSite === s.site);
    const sKm = sTrips.reduce((acc, t) => acc + (t.totalKm || 0), 0);
    const pct = totalKm > 0 ? Math.round((sKm / totalKm) * 100) : 0;
    return {
      site: s.site,
      name: s.name,
      tripCount: sTrips.length,
      totalKm: sKm,
      pct,
    };
  });

  // Vehicle breakdown
  const vehicleBreakdown = vehicles.map((v) => {
    const vTrips = filteredTrips.filter((t) => t.vehicleId === v.id);
    const vKm = vTrips.reduce((acc, t) => acc + (t.totalKm || 0), 0);
    const vFuel = vTrips.reduce((acc, t) => acc + (t.fuelLitres || 0), 0);
    const pct = totalKm > 0 ? Math.round((vKm / totalKm) * 100) : 0;

    return {
      vehicleId: v.id,
      regNumber: v.regNumber,
      model: v.model,
      nickName: v.nickName,
      totalKm: vKm,
      tripCount: vTrips.length,
      totalFuelLitres: vFuel,
      percentageOfTotalKm: pct,
    };
  });

  return {
    filteredTrips,
    stats: {
      totalKm,
      totalTrips,
      operatingDays,
      avgKmPerDay,
      avgKmPerTrip,
      totalFuelLitres,
      totalFuelCost,
      totalTollExpenses,
      estimatedHireCost,
      siteBreakdown,
      vehicleBreakdown,
    },
  };
};

export const getDailyKmBreakdown = (
  trips: TripLog[],
  startDate: string,
  endDate: string
): { date: string; displayDate: string; totalKm: number; bolero1Km: number; bolero2Km: number; camperKm: number }[] => {
  // Build map of dates
  const map = new Map<string, { totalKm: number; bolero1Km: number; bolero2Km: number; camperKm: number }>();

  trips.forEach((t) => {
    if (isDateInRange(t.date, startDate, endDate)) {
      const cur = map.get(t.date) || { totalKm: 0, bolero1Km: 0, bolero2Km: 0, camperKm: 0 };
      cur.totalKm += t.totalKm;
      if (t.vehicleId === 'veh-bolero-1') cur.bolero1Km += t.totalKm;
      else if (t.vehicleId === 'veh-bolero-2') cur.bolero2Km += t.totalKm;
      else if (t.vehicleId === 'veh-camper-1') cur.camperKm += t.totalKm;
      map.set(t.date, cur);
    }
  });

  const sortedDates = Array.from(map.keys()).sort((a, b) => a.localeCompare(b));
  return sortedDates.map((d) => {
    const entry = map.get(d)!;
    const [y, m, day] = d.split('-');
    return {
      date: d,
      displayDate: `${day}/${m}`,
      totalKm: entry.totalKm,
      bolero1Km: entry.bolero1Km,
      bolero2Km: entry.bolero2Km,
      camperKm: entry.camperKm,
    };
  });
};

export const exportTripsToCSV = (trips: TripLog[], filterRangeStr: string): void => {
  const headers = [
    'Date',
    'Voucher No',
    'Vehicle Reg',
    'Vehicle Model',
    'Driver Name',
    'Destination Site',
    'From',
    'To',
    'Via / Area',
    'Shift',
    'Start KM',
    'End KM',
    'Total KM',
    'Fuel Litres',
    'Fuel Cost (INR)',
    'Toll/Expenses (INR)',
    'Purpose / Department',
    'Remarks',
  ];

  const rows = trips.map((t) => [
    `"${t.date}"`,
    `"${t.voucherNumber || ''}"`,
    `"${t.vehicleReg}"`,
    `"${t.vehicleModel}"`,
    `"${t.driverName}"`,
    `"${t.destinationSite || ''}"`,
    `"${t.routeFrom}"`,
    `"${t.routeTo}"`,
    `"${t.viaOrArea || ''}"`,
    `"${t.shift}"`,
    t.startKm,
    t.endKm,
    t.totalKm,
    t.fuelLitres || 0,
    t.fuelCost || 0,
    t.tollOrOtherExpenses || 0,
    `"${(t.purpose || '').replace(/"/g, '""')}"`,
    `"${(t.remarks || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Sandur_Donimalai_Vehicle_Trip_Report_${filterRangeStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
