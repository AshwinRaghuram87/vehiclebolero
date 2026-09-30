import React from 'react';
import { Vehicle, TripLog, FuelLog, OperationalSite, OPERATIONAL_SITES, DEFAULT_DIESEL_PRICE } from '../types/fleet';
import { getTodayString, formatDateDisplay, formatKm, formatCurrency } from '../utils/dateUtils';
import {
  Car,
  Truck,
  PlusCircle,
  Gauge,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle,
  AlertTriangle,
  FileText,
  Fuel,
  Droplet,
  CircleDollarSign,
  Receipt,
  Zap,
  Building,
  Pickaxe,
  Factory,
} from 'lucide-react';

interface DashboardViewProps {
  vehicles: Vehicle[];
  trips: TripLog[];
  fuelLogs?: FuelLog[];
  onOpenTripModalWithVehicle: (vehicleId: string) => void;
  onOpenAddFuelModal?: (vehicleId?: string) => void;
  onNavigateToReports: () => void;
  onNavigateToFuel?: () => void;
  onNavigateToEntry: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  vehicles,
  trips,
  fuelLogs = [],
  onOpenTripModalWithVehicle,
  onOpenAddFuelModal,
  onNavigateToReports,
  onNavigateToFuel,
  onNavigateToEntry,
}) => {
  const todayStr = getTodayString();
  const todayTrips = trips.filter((t) => t.date === todayStr);
  const todayFuelLogs = fuelLogs.filter((f) => f.date === todayStr);

  // Today's Kilometers & Breakdown
  const todayTotalKm = todayTrips.reduce((acc, t) => acc + (t.totalKm || 0), 0);
  const todayBolero1Km = todayTrips
    .filter((t) => t.vehicleId === 'veh-bolero-1')
    .reduce((acc, t) => acc + (t.totalKm || 0), 0);
  const todayBolero2Km = todayTrips
    .filter((t) => t.vehicleId === 'veh-bolero-2')
    .reduce((acc, t) => acc + (t.totalKm || 0), 0);
  const todayCamperKm = todayTrips
    .filter((t) => t.vehicleId === 'veh-camper-1')
    .reduce((acc, t) => acc + (t.totalKm || 0), 0);

  // Today's Fuel & Cost (from dedicated fuel logs + trips)
  const todayFuelLitresFromLogs = todayFuelLogs.reduce((acc, f) => acc + (f.exactLitres || 0), 0);
  const todayFuelCostFromLogs = todayFuelLogs.reduce((acc, f) => acc + (f.amountPaid || 0), 0);
  const todayTripLitres = todayTrips.reduce((acc, t) => acc + (t.fuelLitres || 0), 0);
  const todayTripCost = todayTrips.reduce((acc, t) => acc + (t.fuelCost || 0), 0);

  const todayFuelLitres = Math.max(todayFuelLitresFromLogs, todayTripLitres);
  const todayFuelCost = Math.max(todayFuelCostFromLogs, todayTripCost);

  // Month-to-date stats
  const [currentYear, currentMonth] = todayStr.split('-');
  const monthPrefix = `${currentYear}-${currentMonth}`;
  const monthTrips = trips.filter((t) => t.date.startsWith(monthPrefix));
  const monthFuelLogs = fuelLogs.filter((f) => f.date.startsWith(monthPrefix));

  const monthKm = monthTrips.reduce((acc, t) => acc + (t.totalKm || 0), 0);
  const monthFuelLogsLitres = monthFuelLogs.reduce((acc, f) => acc + (f.exactLitres || 0), 0);
  const monthFuelLogsCost = monthFuelLogs.reduce((acc, f) => acc + (f.amountPaid || 0), 0);
  const monthTripLitres = monthTrips.reduce((acc, t) => acc + (t.fuelLitres || 0), 0);
  const monthTripCost = monthTrips.reduce((acc, t) => acc + (t.fuelCost || 0), 0);

  const monthFuelLitres = Math.max(monthFuelLogsLitres, monthTripLitres);
  const monthFuelCost = Math.max(monthFuelLogsCost, monthTripCost);

  // Overall Total Fuel & Cost monitoring
  const allTimeTotalKm = trips.reduce((acc, t) => acc + (t.totalKm || 0), 0);
  const totalLogsLitres = fuelLogs.reduce((acc, f) => acc + (f.exactLitres || 0), 0);
  const totalLogsCost = fuelLogs.reduce((acc, f) => acc + (f.amountPaid || 0), 0);
  const totalTripLitres = trips.reduce((acc, t) => acc + (t.fuelLitres || 0), 0);
  const totalTripCost = trips.reduce((acc, t) => acc + (t.fuelCost || 0), 0);

  const allTimeFuelLitres = Math.max(totalLogsLitres, totalTripLitres);
  const allTimeFuelCost = Math.max(totalLogsCost, totalTripCost);

  const overallMileage =
    allTimeFuelLitres > 0 ? (allTimeTotalKm / allTimeFuelLitres).toFixed(1) : 'N/A';
  const avgDieselCostPerLitre = DEFAULT_DIESEL_PRICE;

  // Recent refuels list
  const recentFuelItems = fuelLogs.length > 0
    ? fuelLogs.slice(0, 5)
    : trips.filter((t) => t.fuelLitres && t.fuelLitres > 0).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner & Today's Corridor Status */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-slate-50 border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-amber-200 text-amber-800 text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              Live Transport Log • Sandur to Donimalai Corridor
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Office Hired Vehicle Trip Monitor
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Monitoring 3 dedicated hired vehicles (2 Mahindra Boleros & 1 Mahindra Camper) for daily
              office commute, site inspections, and material logistics between Sandur Head Office and Donimalai Mines.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToEntry}
              className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-xs text-sm transition-all transform active:scale-95 whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Log Daily Trip</span>
            </button>
            <button
              onClick={onNavigateToReports}
              className="flex items-center space-x-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-4 py-2.5 rounded-xl border border-slate-300 text-sm transition-all whitespace-nowrap shadow-xs"
            >
              <span>KM Reports</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Monitoring KPI Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1: Total Kilometers Driven Today across all vehicles */}
        <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50/40 border-2 border-amber-300 rounded-2xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-amber-600" />
                Total KM Driven Today
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-200">
                3 Vehicles
              </span>
            </div>

            <div className="flex items-baseline gap-2 pt-2">
              <span className="text-3xl sm:text-4xl font-black font-mono text-slate-900 tracking-tight">
                {todayTotalKm.toLocaleString()}
              </span>
              <span className="text-base font-bold font-mono text-amber-600">KM</span>
            </div>

            <p className="text-xs text-slate-600">
              {todayTrips.length} active trip{todayTrips.length !== 1 ? 's' : ''} recorded for {formatDateDisplay(todayStr)}
            </p>
          </div>

          {/* Per-vehicle mini pills */}
          <div className="pt-3 mt-3 border-t border-amber-200/80 grid grid-cols-3 gap-1.5 text-center text-[11px]">
            <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-xs">
              <span className="text-slate-500 block text-[9px] font-semibold">Bolero #1</span>
              <strong className="text-sky-700 font-mono font-bold">{todayBolero1Km} km</strong>
            </div>
            <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-xs">
              <span className="text-slate-500 block text-[9px] font-semibold">Bolero #2</span>
              <strong className="text-emerald-700 font-mono font-bold">{todayBolero2Km} km</strong>
            </div>
            <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-xs">
              <span className="text-slate-500 block text-[9px] font-semibold">Camper</span>
              <strong className="text-amber-700 font-mono font-bold">{todayCamperKm} km</strong>
            </div>
          </div>
        </div>

        {/* CARD 2: Today's Fuel Filled & Daily Fuel Cost */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-700 flex items-center gap-1.5">
                <Fuel className="w-4 h-4 text-orange-600" />
                Today's Fuel & Cost
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-50 text-orange-800 font-bold border border-orange-200">
                Daily Refuel
              </span>
            </div>

            <div className="flex items-baseline gap-2 pt-2">
              <span className="text-3xl font-black font-mono text-slate-900 tracking-tight">
                {todayFuelLitres}
              </span>
              <span className="text-sm font-bold text-slate-600">Litres</span>
            </div>

            <div className="text-sm font-bold font-mono text-emerald-700 flex items-center gap-1">
              <span>Cost: {formatCurrency(todayFuelCost)}</span>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
            <span>Diesel refills today:</span>
            <span className="font-mono font-semibold text-slate-800">
              {todayTrips.filter((t) => (t.fuelLitres || 0) > 0).length} logs
            </span>
          </div>
        </div>

        {/* CARD 3: Month-to-Date (MTD) Kilometers */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                Month-to-Date KM
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200">
                {new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
              </span>
            </div>

            <div className="flex items-baseline gap-2 pt-2">
              <span className="text-3xl font-black font-mono text-slate-900 tracking-tight">
                {monthKm.toLocaleString()}
              </span>
              <span className="text-sm font-bold font-mono text-emerald-600">KM</span>
            </div>

            <p className="text-xs text-slate-500">
              {monthTrips.length} trips across {new Set(monthTrips.map((t) => t.date)).size} days
            </p>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
            <span>Daily average:</span>
            <span className="font-mono font-semibold text-emerald-700">
              {new Set(monthTrips.map((t) => t.date)).size > 0
                ? Math.round(monthKm / new Set(monthTrips.map((t) => t.date)).size)
                : 0}{' '}
              km/day
            </span>
          </div>
        </div>

        {/* CARD 4: Total Fuel Cost & Efficiency Monitoring */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-emerald-600" />
                MTD Fuel Cost & Mileage
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                Monitoring
              </span>
            </div>

            <div className="flex items-baseline gap-2 pt-2">
              <span className="text-3xl font-black font-mono text-emerald-700 tracking-tight">
                {formatCurrency(monthFuelCost)}
              </span>
            </div>

            <p className="text-xs text-slate-600">
              <strong className="text-orange-700 font-mono">{monthFuelLitres} Litres</strong> diesel this month
            </p>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
            <span>Corridor Avg Mileage:</span>
            <span className="font-mono font-bold text-amber-700">
              {monthFuelLitres > 0 ? (monthKm / monthFuelLitres).toFixed(1) : overallMileage} km/L
            </span>
          </div>
        </div>
      </div>

      {/* Fuel Filled & Cost Monitoring Dedicated Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-50 border border-orange-200 text-orange-600">
              <Fuel className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Fuel Filled & Cost Monitoring
                <span className="text-[10px] px-2 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200 font-mono">
                  Diesel Tracker
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Tracking diesel volume filled, refueling expenses, and kilometer-per-litre efficiency
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-orange-700 font-mono font-bold">
              Rate: ₹{DEFAULT_DIESEL_PRICE}/L
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-amber-700 font-mono font-bold">
              Fleet Avg: {overallMileage} KM/L
            </span>

            {onOpenAddFuelModal && (
              <button
                onClick={() => onOpenAddFuelModal()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold transition-all shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Add Fuel (₹100.04/L)</span>
              </button>
            )}

            <button
              onClick={onNavigateToFuel || onNavigateToReports}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium transition-colors"
            >
              <span>Monthly Fuel Report</span>
              <ArrowRight className="w-3 h-3 text-orange-600" />
            </button>
          </div>
        </div>

        {/* 3-Column Vehicle-wise Fuel Consumption Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {vehicles.map((v) => {
            const vTrips = trips.filter((t) => t.vehicleId === v.id);
            const vFuelLogs = fuelLogs.filter((f) => f.vehicleId === v.id);

            const vTotalKm = vTrips.reduce((acc, t) => acc + (t.totalKm || 0), 0);
            const vFuelLogsLitres = vFuelLogs.reduce((acc, f) => acc + (f.exactLitres || 0), 0);
            const vFuelLogsCost = vFuelLogs.reduce((acc, f) => acc + (f.amountPaid || 0), 0);
            const vTripLitres = vTrips.reduce((acc, t) => acc + (t.fuelLitres || 0), 0);
            const vTripCost = vTrips.reduce((acc, t) => acc + (t.fuelCost || 0), 0);

            const vFuelLitres = Math.max(vFuelLogsLitres, vTripLitres);
            const vFuelCost = Math.max(vFuelLogsCost, vTripCost);
            const vMileage = vFuelLitres > 0 ? (vTotalKm / vFuelLitres).toFixed(1) : '-';

            const vTodayTrips = todayTrips.filter((t) => t.vehicleId === v.id);
            const vTodayFuelLogs = todayFuelLogs.filter((f) => f.vehicleId === v.id);
            const vTodayLogsLitres = vTodayFuelLogs.reduce((acc, f) => acc + (f.exactLitres || 0), 0);
            const vTodayLogsCost = vTodayFuelLogs.reduce((acc, f) => acc + (f.amountPaid || 0), 0);
            const vTodayTripLitres = vTodayTrips.reduce((acc, t) => acc + (t.fuelLitres || 0), 0);
            const vTodayTripCost = vTodayTrips.reduce((acc, t) => acc + (t.fuelCost || 0), 0);

            const vTodayFuel = Math.max(vTodayLogsLitres, vTodayTripLitres);
            const vTodayCost = Math.max(vTodayLogsCost, vTodayTripCost);

            return (
              <div
                key={v.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 hover:border-slate-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">{v.nickName}</span>
                    <span className="text-[11px] font-mono text-slate-500">{v.regNumber}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white text-amber-700 border border-slate-200">
                    {vMileage !== '-' ? `${vMileage} km/L` : 'Mileage Pending'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Total Fuel Filled</span>
                    <strong className="font-mono text-orange-700 font-bold">{vFuelLitres.toFixed(1)} L</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Total Fuel Cost</span>
                    <strong className="font-mono text-emerald-700 font-bold">{formatCurrency(vFuelCost)}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  {vTodayFuel > 0 ? (
                    <div className="px-2 py-1 rounded bg-orange-50 border border-orange-200 text-[11px] text-orange-800 font-mono">
                      Today: {vTodayFuel.toFixed(1)} L ({formatCurrency(vTodayCost)})
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-400 italic">No refuel today</div>
                  )}

                  {onOpenAddFuelModal && (
                    <button
                      onClick={() => onOpenAddFuelModal(v.id)}
                      className="text-[11px] text-orange-700 hover:text-orange-900 font-bold flex items-center gap-1"
                    >
                      <span>+ Refuel</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Fuel Refueling Log Table */}
        {recentFuelItems.length > 0 && (
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600">
                Recent Diesel Refill Slips & Expenses (Calculated at ₹{DEFAULT_DIESEL_PRICE}/L):
              </span>
              <button
                onClick={onNavigateToFuel || onNavigateToReports}
                className="text-[11px] text-orange-700 hover:underline font-semibold"
              >
                View Complete Logbook →
              </button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Vehicle</th>
                    <th className="py-2.5 px-3">Driver</th>
                    <th className="py-2.5 px-3 font-bold text-orange-700">Exact Fuel (Litres)</th>
                    <th className="py-2.5 px-3 font-bold text-emerald-700">Round Paid (₹)</th>
                    <th className="py-2.5 px-3">Fuel Bunk / Voucher</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {recentFuelItems.map((item: any) => {
                    const isDedicatedLog = 'exactLitres' in item;
                    const litres = isDedicatedLog ? item.exactLitres : item.fuelLitres;
                    const cost = isDedicatedLog ? item.amountPaid : item.fuelCost;
                    const ref = isDedicatedLog ? (item.slipNumber || item.fuelBunk) : (item.voucherNumber || '-');

                    return (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-mono text-slate-700">{formatDateDisplay(item.date)}</td>
                        <td className="py-2 px-3 font-medium text-slate-900">{item.vehicleModel} ({item.vehicleReg})</td>
                        <td className="py-2 px-3 text-slate-700">{item.driverName}</td>
                        <td className="py-2 px-3 font-mono font-bold text-orange-700">{Number(litres || 0).toFixed(2)} L</td>
                        <td className="py-2 px-3 font-mono font-bold text-emerald-700">{formatCurrency(cost || 0)}</td>
                        <td className="py-2 px-3 font-mono text-slate-500 truncate max-w-[180px]">{ref}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* The 3 Hired Vehicles Live Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-600" />
              Assigned Hired Vehicles ({vehicles.length} Units)
            </h2>
            <p className="text-xs text-slate-500">
              Active commercial and utility fleet hired for Sandur to Donimalai transit operations
            </p>
          </div>
          <button
            onClick={onNavigateToEntry}
            className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1"
          >
            <span>Manual Trip Entry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((v) => {
            const isCamper = v.model.toLowerCase().includes('camper') || v.model.toLowerCase().includes('yodha');
            const vTrips = trips.filter((t) => t.vehicleId === v.id);
            const latestTrip = vTrips[0];
            const vTodayTrips = todayTrips.filter((t) => t.vehicleId === v.id);
            const vTodayKm = vTodayTrips.reduce((acc, t) => acc + t.totalKm, 0);
            const vTotalFuel = vTrips.reduce((acc, t) => acc + (t.fuelLitres || 0), 0);
            const vTotalFuelCost = vTrips.reduce((acc, t) => acc + (t.fuelCost || 0), 0);
            const vColor = v.color || '#0284c7';

            return (
              <div
                key={v.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between transition-all"
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shadow-xs"
                        style={{ backgroundColor: vColor }}
                      >
                        {isCamper ? <Truck className="w-6 h-6" /> : <Car className="w-6 h-6" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-slate-900">{v.nickName}</h3>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-amber-700">
                            {v.regNumber}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            {v.tag}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {v.status}
                    </span>
                  </div>

                  {/* Model & Driver Info */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                    <div className="flex justify-between text-slate-500">
                      <span>Model:</span>
                      <span className="font-medium text-slate-800">{v.modelVariant}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Assigned Driver:</span>
                      <span className="font-semibold text-slate-800">{v.driverName}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Contract Rate:</span>
                      <span className="font-mono text-amber-700 font-semibold">₹{v.contractRatePerKm} / KM</span>
                    </div>
                  </div>

                  {/* Odometer gauge */}
                  <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <Gauge className="w-4 h-4 text-amber-600" />
                      <span>Current Odometer</span>
                    </div>
                    <span className="font-mono text-base font-bold text-slate-900 tracking-wide">
                      {v.currentOdometer.toLocaleString()}{' '}
                      <span className="text-xs text-slate-500 font-normal">KM</span>
                    </span>
                  </div>

                  {/* Today's KM & Fuel monitoring snippet */}
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Today's Run</span>
                      <span className="font-mono font-bold text-amber-700 text-sm">
                        {vTodayKm} KM
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Fuel Logged</span>
                      <span className="font-mono font-bold text-orange-700 text-sm">
                        {vTotalFuel}L <span className="text-[10px] text-slate-500 font-normal">({formatCurrency(vTotalFuelCost)})</span>
                      </span>
                    </div>
                  </div>

                  {/* Latest Trip snippet */}
                  {latestTrip ? (
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500">Last Logged Trip:</span>
                        <span className="font-mono text-slate-700">{formatDateDisplay(latestTrip.date)}</span>
                      </div>
                      <div className="font-medium text-slate-900 truncate">
                        {latestTrip.routeFrom} ⇄ {latestTrip.routeTo}
                      </div>
                      <div className="flex justify-between items-center text-[11px] pt-1">
                        <span className="text-amber-700 font-mono font-bold">
                          {latestTrip.totalKm} KM
                        </span>
                        <span className="text-slate-500 truncate max-w-[120px]">
                          {latestTrip.shift.split('(')[0]}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 italic p-2 text-center">
                      No trip logged yet
                    </div>
                  )}
                </div>

                {/* Quick CTA */}
                <div className="pt-2">
                  <button
                    onClick={() => onOpenTripModalWithVehicle(v.id)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-800 text-xs font-bold border border-slate-200 hover:border-amber-500 transition-all shadow-xs"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Log Daily Trip for {v.nickName.split(' ')[0]}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Operational Site Duty Activity Monitor */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Operational Site Duty Breakdown
                <span className="text-xs font-normal text-slate-500">
                  (DIOM, KIOM, PPT & Admin Building)
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Monitoring vehicle movements across mining benches, processing plants, and administrative duties
              </p>
            </div>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Active Duty Sites: <strong>4 Locations</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {OPERATIONAL_SITES.map((site) => {
            const siteTrips = trips.filter((t) => t.destinationSite === site.id);
            const siteKm = siteTrips.reduce((acc, t) => acc + (t.totalKm || 0), 0);
            const siteTodayTrips = todayTrips.filter((t) => t.destinationSite === site.id);
            const siteTodayKm = siteTodayTrips.reduce((acc, t) => acc + (t.totalKm || 0), 0);

            return (
              <div
                key={site.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-xs font-black font-mono px-2 py-0.5 rounded border ${
                        site.id === 'DIOM'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : site.id === 'KIOM'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : site.id === 'PPT'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {site.id}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {siteTrips.length} trip{siteTrips.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900">{site.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{site.shortDesc}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 text-xs flex justify-between items-center">
                  <span className="text-slate-500">Total KM:</span>
                  <span className="font-mono font-bold text-amber-700">{siteKm.toLocaleString()} KM</span>
                </div>

                {siteTodayTrips.length > 0 ? (
                  <div className="text-[10px] font-mono px-2 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 flex justify-between">
                    <span>Today: {siteTodayTrips.length} trip</span>
                    <strong>{siteTodayKm} KM</strong>
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-400 italic">No trips today</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Trips Log Summary */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              Recent Trip Logs & Site Duties
            </h3>
            <p className="text-xs text-slate-500">Latest manual odometer logs across the 3 hired vehicles</p>
          </div>
          <button
            onClick={onNavigateToReports}
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
          >
            <span>View All KM Reports</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Site Duty</th>
                <th className="py-3 px-4">Driver</th>
                <th className="py-3 px-4">Route / Location</th>
                <th className="py-3 px-4">Odometer Run</th>
                <th className="py-3 px-4 font-bold text-amber-700">Total KM</th>
                <th className="py-3 px-4 font-bold text-orange-700">Fuel & Cost</th>
                <th className="py-3 px-4">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {trips.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No trips logged yet. Click &quot;Log Trip&quot; above to record your first transit run.
                  </td>
                </tr>
              ) : (
                trips.slice(0, 6).map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap font-bold text-slate-800">
                      {formatDateDisplay(t.date)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-900">{t.vehicleModel}</span>{' '}
                      <span className="font-mono text-[11px] text-slate-500">({t.vehicleReg})</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                          t.destinationSite === 'DIOM'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : t.destinationSite === 'KIOM'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : t.destinationSite === 'PPT'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {t.destinationSite || 'DIOM'}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-700">{t.driverName}</td>
                    <td className="py-3 px-4 text-slate-700">
                      {t.routeFrom} <span className="text-amber-600">⇄</span> {t.routeTo}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 whitespace-nowrap">
                      {t.startKm} → {t.endKm}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200">
                        {t.totalKm} KM
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-xs">
                      {t.fuelLitres && t.fuelLitres > 0 ? (
                        <span className="text-orange-700 font-semibold">
                          {t.fuelLitres}L <span className="text-slate-500">({formatCurrency(t.fuelCost || 0)})</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600 truncate max-w-[200px]">{t.purpose}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
