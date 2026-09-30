import React, { useState, useMemo, useEffect } from 'react';
import { Vehicle, TripLog, FuelLog, DatePresetKey, DateRangeFilter } from '../types/fleet';
import {
  formatDateDisplay,
  formatDayName,
  getPresetDateRange,
  formatKm,
  formatCurrency,
  getTodayString,
} from '../utils/dateUtils';
import { calculateReportStats, getDailyKmBreakdown, exportTripsToCSV } from '../utils/reportUtils';
import { MonthlyFuelReportView } from './MonthlyFuelReportView';
import {
  Calendar,
  Filter,
  Download,
  Printer,
  Car,
  Truck,
  Fuel,
  TrendingUp,
  Search,
  Trash2,
  Edit2,
  Copy,
  ChevronDown,
  ArrowUpDown,
  FileCheck,
  CheckCircle2,
  X,
  MapPin,
  PlusCircle,
  BarChart3,
} from 'lucide-react';

interface KmReportsViewProps {
  trips: TripLog[];
  vehicles: Vehicle[];
  fuelLogs?: FuelLog[];
  defaultSubTab?: 'km-range' | 'monthly-fuel';
  onOpenAddFuelModal?: (vehicleId?: string) => void;
  onDeleteFuelLog?: (logId: string) => void;
  onEditTrip: (trip: TripLog) => void;
  onDeleteTrip: (tripId: string) => void;
  onDuplicateTrip: (trip: TripLog) => void;
}

export const KmReportsView: React.FC<KmReportsViewProps> = ({
  trips,
  vehicles,
  fuelLogs = [],
  defaultSubTab = 'km-range',
  onOpenAddFuelModal,
  onDeleteFuelLog,
  onEditTrip,
  onDeleteTrip,
  onDuplicateTrip,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'km-range' | 'monthly-fuel'>(defaultSubTab);

  useEffect(() => {
    if (defaultSubTab) {
      setActiveSubTab(defaultSubTab);
    }
  }, [defaultSubTab]);

  // Date range filter state
  const [preset, setPreset] = useState<DatePresetKey>('thisMonth');
  const initialRange = getPresetDateRange('thisMonth');
  const [startDate, setStartDate] = useState<string>(initialRange.startDate);
  const [endDate, setEndDate] = useState<string>(initialRange.endDate);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('all');
  const [selectedSiteFilter, setSelectedSiteFilter] = useState<string>('all');
  const [selectedRouteFilter, setSelectedRouteFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'km-desc' | 'km-asc'>('date-desc');
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [hoveredBar, setHoveredBar] = useState<any | null>(null);

  // Handle Preset selection
  const handlePresetChange = (newPreset: DatePresetKey) => {
    setPreset(newPreset);
    if (newPreset !== 'custom') {
      const range = getPresetDateRange(newPreset);
      setStartDate(range.startDate);
      setEndDate(range.endDate);
    }
  };

  const filter: DateRangeFilter = {
    preset,
    startDate,
    endDate,
    vehicleId: selectedVehicleId,
    siteFilter: selectedSiteFilter,
    routeFilter: selectedRouteFilter,
  };

  // Compute report statistics
  const { filteredTrips, stats } = useMemo(() => {
    return calculateReportStats(trips, vehicles, filter);
  }, [trips, vehicles, filter]);

  // Compute daily breakdown for chart
  const dailyBreakdown = useMemo(() => {
    return getDailyKmBreakdown(trips, startDate, endDate, vehicles);
  }, [trips, startDate, endDate, vehicles]);

  // Filtered and searched trips for table
  const displayedTrips = useMemo(() => {
    let result = [...filteredTrips];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.driverName.toLowerCase().includes(q) ||
          t.vehicleReg.toLowerCase().includes(q) ||
          (t.destinationSite && t.destinationSite.toLowerCase().includes(q)) ||
          t.purpose.toLowerCase().includes(q) ||
          t.routeTo.toLowerCase().includes(q) ||
          t.routeFrom.toLowerCase().includes(q) ||
          (t.voucherNumber && t.voucherNumber.toLowerCase().includes(q)) ||
          (t.officerOrDept && t.officerOrDept.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'date-desc') {
        return b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt);
      }
      if (sortBy === 'date-asc') {
        return a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt);
      }
      if (sortBy === 'km-desc') {
        return b.totalKm - a.totalKm;
      }
      if (sortBy === 'km-asc') {
        return a.totalKm - b.totalKm;
      }
      return 0;
    });

    return result;
  }, [filteredTrips, searchQuery, sortBy]);

  // Max daily KM for chart scaling
  const maxDayKm = useMemo(() => {
    const maxVal = Math.max(...dailyBreakdown.map((d) => d.totalKm), 50);
    return Math.ceil(maxVal / 20) * 20; // round up to multiple of 20
  }, [dailyBreakdown]);

  const handleExportCSV = () => {
    const rangeLabel = `${startDate}_to_${endDate}`;
    exportTripsToCSV(displayedTrips, rangeLabel);
  };

  const selectedVehicleName =
    selectedVehicleId === 'all'
      ? `All ${vehicles.length} Vehicles`
      : vehicles.find((v) => v.id === selectedVehicleId)?.nickName || 'Selected Vehicle';

  return (
    <div className="space-y-6">
      {/* Reports Section Navigation Tabs */}
      <div className="bg-slate-100 border border-slate-200 p-1.5 rounded-2xl flex flex-wrap items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveSubTab('km-range')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'km-range'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>KM Range & Trip Reports</span>
          </button>

          <button
            onClick={() => setActiveSubTab('monthly-fuel')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'monthly-fuel'
                ? 'bg-orange-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Fuel className="w-4 h-4" />
            <span>Monthly Fuel & Cost Summary</span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/10 text-current">
              ₹100.04/L
            </span>
          </button>
        </div>

        {onOpenAddFuelModal && (
          <button
            onClick={() => onOpenAddFuelModal()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-bold transition-all ml-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Fuel Refill (₹100.04/L)</span>
          </button>
        )}
      </div>

      {activeSubTab === 'monthly-fuel' ? (
        <MonthlyFuelReportView
          vehicles={vehicles}
          trips={trips}
          fuelLogs={fuelLogs}
          onOpenAddFuelModal={onOpenAddFuelModal || (() => {})}
          onDeleteFuelLog={onDeleteFuelLog || (() => {})}
        />
      ) : (
        <>
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              KM Range & Mileage Reports
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              Date Filtered
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Generate and audit vehicle kilometer logs, fuel usage, and contract billing between Sandur and Donimalai
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs sm:text-sm font-semibold transition-all shadow-xs"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowPrintModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold transition-all shadow-xs"
          >
            <Printer className="w-4 h-4 stroke-[2.5]" />
            <span>Print Official Log</span>
          </button>
        </div>
      </div>

      {/* Date Filter & Selector Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        {/* Preset Pill Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            Date Presets:
          </span>
          {[
            { key: 'today', label: 'Today' },
            { key: 'yesterday', label: 'Yesterday' },
            { key: 'last7days', label: 'Last 7 Days' },
            { key: 'thisMonth', label: 'This Month (Current)' },
            { key: 'lastMonth', label: 'Last Month' },
            { key: 'custom', label: 'Custom Date Range' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => handlePresetChange(item.key as DatePresetKey)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                preset === item.key
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Date Inputs & Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-200 items-center">
          {/* Start Date */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">From Date (Start)</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPreset('custom');
              }}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">To Date (End)</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPreset('custom');
              }}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Vehicle Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Filter by Vehicle</label>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All 3 Vehicles (Both Boleros & Camper)</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.nickName} ({v.regNumber})
                </option>
              ))}
            </select>
          </div>

          {/* Site Duty Filter (DIOM, KIOM, PPT, Stay at Admin Building) */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Site Duty Selection
            </label>
            <select
              value={selectedSiteFilter}
              onChange={(e) => setSelectedSiteFilter(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Duty Sites (DIOM, KIOM, PPT, Admin)</option>
              <option value="DIOM">DIOM (Donimalai Iron Ore Mine)</option>
              <option value="KIOM">KIOM (Kumaraswamy Iron Ore Mine)</option>
              <option value="PPT">PPT (Pellet Plant / Plant Area)</option>
              <option value="Admin Building">Stay at Admin Building</option>
            </select>
          </div>
        </div>

        {/* Selected Range Display Banner */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200">
          <div>
            Reporting Window:{' '}
            <strong className="text-amber-700 font-mono">
              {formatDateDisplay(startDate)}
            </strong>{' '}
            to{' '}
            <strong className="text-amber-700 font-mono">
              {formatDateDisplay(endDate)}
            </strong>{' '}
            • Vehicle: <strong className="text-slate-900">{selectedVehicleName}</strong>
          </div>
          <div className="font-mono text-emerald-700 font-semibold">
            {stats.operatingDays} Operating Days • {stats.totalTrips} Total Trips
          </div>
        </div>
      </div>

      {/* KPI Cards for Selected Date Range */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total KM */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-orange-50 border border-amber-300 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>Total KM Run</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-amber-700 tracking-tight">
            {stats.totalKm.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">In selected period</span>
        </div>

        {/* Total Trips */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>Total Trips</span>
            <Car className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 tracking-tight">
            {stats.totalTrips}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Between Sandur & Doni</span>
        </div>

        {/* Avg KM/Day */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>Daily Average</span>
            <Calendar className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-700 tracking-tight">
            {stats.avgKmPerDay}
            <span className="text-xs font-normal text-slate-500 ml-1">km/d</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Across {stats.operatingDays} active days</span>
        </div>

        {/* Avg KM/Trip */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>Avg / Trip</span>
            <Truck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 tracking-tight">
            {stats.avgKmPerTrip}
            <span className="text-xs font-normal text-slate-500 ml-1">km</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Corridor average</span>
        </div>

        {/* Fuel Consumed */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>Fuel Added</span>
            <Fuel className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-orange-600 tracking-tight">
            {stats.totalFuelLitres}
            <span className="text-xs font-normal text-slate-500 ml-1">L</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {formatCurrency(stats.totalFuelCost)}
          </span>
        </div>

        {/* Estimated Hire Cost */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>Est. Hire Cost</span>
            <FileCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-700 tracking-tight">
            {formatCurrency(stats.estimatedHireCost)}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Based on KM rates</span>
        </div>
      </div>

      {/* Vehicle Comparison Breakdown (Bolero 1 vs Bolero 2 vs Camper) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-600" />
              KM Range Distribution by Vehicle ({vehicles.length} Units)
            </h3>
            <p className="text-xs text-slate-500">
              Side-by-side operational distance and fuel distribution across active fleet vehicles
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Total: <strong className="text-amber-700">{formatKm(stats.totalKm)}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.vehicleBreakdown.map((vb) => {
            const vehicleObj = vehicles.find((v) => v.id === vb.vehicleId);
            const barColor = vehicleObj?.color || (vb.model.toLowerCase().includes('camper') ? '#f59e0b' : '#0284c7');

            return (
              <div
                key={vb.vehicleId}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{vb.nickName}</span>
                    </div>
                    <span className="text-xs font-mono text-slate-500">{vb.regNumber}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-white text-slate-700 border border-slate-300">
                    {vb.percentageOfTotalKm}% KM
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(5, vb.percentageOfTotalKm)}%`,
                      backgroundColor: barColor,
                    }}
                  ></div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-center text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block">KM Covered</span>
                    <strong className="font-mono text-slate-900 text-sm">{vb.totalKm}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Trips</span>
                    <strong className="font-mono text-slate-900 text-sm">{vb.tripCount}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Fuel Logged</span>
                    <strong className="font-mono text-slate-900 text-sm">
                      {vb.totalFuelLitres > 0 ? `${vb.totalFuelLitres}L` : '-'}
                    </strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Operational Site Duty Breakdown (DIOM, KIOM, PPT, Stay at Admin Building) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600" />
              KM & Trips by Operational Site Duty
            </h3>
            <p className="text-xs text-slate-500">
              Breakdown of whether vehicle went to DIOM, KIOM, PPT, or stayed at the Admin Building
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {stats.siteBreakdown.reduce((acc, s) => acc + s.tripCount, 0)} Total Filtered Trips
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.siteBreakdown.map((s) => (
            <div
              key={s.site}
              onClick={() => setSelectedSiteFilter(selectedSiteFilter === s.site ? 'all' : s.site)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedSiteFilter === s.site
                  ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/30'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-[11px] font-mono font-black px-2 py-0.5 rounded border ${
                    s.site === 'DIOM'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : s.site === 'KIOM'
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : s.site === 'PPT'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {s.site}
                </span>
                <span className="font-mono text-xs font-bold text-amber-700">{s.pct}% KM</span>
              </div>
              <div className="font-bold text-xs text-slate-900">{s.name}</div>
              <div className="flex justify-between items-center text-xs pt-2 mt-2 border-t border-slate-200">
                <span className="text-slate-500">{s.tripCount} Trips</span>
                <strong className="font-mono text-slate-900">{s.totalKm} KM</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily KM Trend Chart (Interactive SVG Bar Chart) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              Daily KM Run Trend in Date Window
            </h3>
            <p className="text-xs text-slate-500">Kilometers logged per operating day in the selected range</p>
          </div>
          {/* Chart Legend */}
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-sm bg-sky-500"></span> Bolero 1
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> Bolero 2
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span> Camper
            </span>
          </div>
        </div>

        {dailyBreakdown.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No trip records found for the chosen date range. Log a trip or change filters above.
          </div>
        ) : (
          <div className="relative pt-6 pb-2 overflow-x-auto">
            {/* Hover Tooltip */}
            {hoveredBar && (
              <div className="absolute top-0 right-4 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 shadow-md pointer-events-none z-10 flex flex-wrap items-center gap-2 max-w-md">
                <span className="font-bold text-amber-700">{hoveredBar.date}:</span>
                <span>Total: <strong>{hoveredBar.totalKm} KM</strong></span>
                {vehicles.map((v) => {
                  const km =
                    hoveredBar.vehicleKmMap?.[v.id] ??
                    (v.id === 'veh-bolero-1'
                      ? hoveredBar.bolero1Km
                      : v.id === 'veh-bolero-2'
                      ? hoveredBar.bolero2Km
                      : v.id === 'veh-camper-1'
                      ? hoveredBar.camperKm
                      : 0);
                  if (!km) return null;
                  return (
                    <span
                      key={v.id}
                      className="font-mono text-[11px] font-semibold"
                      style={{ color: v.color || '#0284c7' }}
                    >
                      {v.nickName.split(' ')[0]}: {km}k
                    </span>
                  );
                })}
              </div>
            )}

            <div className="min-w-[580px] h-48 flex items-end gap-2 sm:gap-3 px-2 border-b border-slate-200">
              {dailyBreakdown.map((item, idx) => {
                const heightPct = Math.min(100, Math.max(8, (item.totalKm / maxDayKm) * 100));

                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredBar(item)}
                    onMouseLeave={() => setHoveredBar(null)}
                    className="flex-1 flex flex-col items-center group cursor-pointer h-full justify-end"
                  >
                    <div className="text-[10px] font-mono text-slate-500 group-hover:text-amber-700 transition-colors mb-1 font-semibold">
                      {item.totalKm}k
                    </div>

                    {/* Stacked Bar */}
                    <div
                      className="w-full max-w-[28px] rounded-t-md overflow-hidden flex flex-col-reverse transition-all duration-300 group-hover:brightness-95"
                      style={{ height: `${heightPct}%` }}
                    >
                      {vehicles.map((v) => {
                        const km =
                          item.vehicleKmMap?.[v.id] ??
                          (v.id === 'veh-bolero-1'
                            ? item.bolero1Km
                            : v.id === 'veh-bolero-2'
                            ? item.bolero2Km
                            : v.id === 'veh-camper-1'
                            ? item.camperKm
                            : 0);
                        if (!km || item.totalKm <= 0) return null;
                        const pct = (km / item.totalKm) * 100;
                        return (
                          <div
                            key={v.id}
                            className="w-full transition-all"
                            style={{ height: `${pct}%`, backgroundColor: v.color || '#0284c7' }}
                            title={`${v.nickName}: ${km} km`}
                          />
                        );
                      })}
                    </div>

                    <div className="text-[10px] text-slate-500 mt-2 font-mono group-hover:text-slate-800">
                      {item.displayDate}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Filtered Trips Table & Logbook */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        {/* Table Top Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-amber-600" />
              Itemized Daily Trip Logbook ({displayedTrips.length} Entries)
            </h3>
            <p className="text-xs text-slate-500">
              Showing manually recorded trips in the date range with odometer readings
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search driver, route, voucher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 w-44 sm:w-60"
              />
            </div>

            {/* Sort Toggle */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
            >
              <option value="date-desc">Newest Date</option>
              <option value="date-asc">Oldest Date</option>
              <option value="km-desc">Highest KM</option>
              <option value="km-asc">Lowest KM</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {displayedTrips.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              No trip entries match your search criteria.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Date & Slip</th>
                  <th className="py-3 px-4">Hired Vehicle</th>
                  <th className="py-3 px-4">Site Duty</th>
                  <th className="py-3 px-4">Driver</th>
                  <th className="py-3 px-4">Route / Location</th>
                  <th className="py-3 px-4">Start KM</th>
                  <th className="py-3 px-4">End KM</th>
                  <th className="py-3 px-4 text-amber-700 font-bold">Total KM</th>
                  <th className="py-3 px-4">Fuel & Toll</th>
                  <th className="py-3 px-4">Purpose / Dept</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedTrips.map((trip) => {
                  const isCamper = trip.vehicleModel === 'Mahindra Camper';
                  return (
                    <tr
                      key={trip.id}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      {/* Date & Slip */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{formatDateDisplay(trip.date)}</div>
                        <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                          <span>{formatDayName(trip.date)}</span>
                          {trip.voucherNumber && (
                            <span className="text-amber-700">• {trip.voucherNumber}</span>
                          )}
                        </div>
                      </td>

                      {/* Vehicle */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={`p-1 rounded ${
                              isCamper
                                ? 'bg-amber-100 text-amber-800'
                                : trip.vehicleReg.includes('4821')
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {isCamper ? <Truck className="w-3.5 h-3.5" /> : <Car className="w-3.5 h-3.5" />}
                          </span>
                          <div>
                            <span className="font-semibold text-slate-900 block">
                              {trip.vehicleModel}
                            </span>
                            <span className="font-mono text-[11px] text-slate-500">
                              {trip.vehicleReg}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Site Duty */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                            trip.destinationSite === 'DIOM'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : trip.destinationSite === 'KIOM'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : trip.destinationSite === 'PPT'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {trip.destinationSite || 'DIOM'}
                        </span>
                      </td>

                      {/* Driver */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-900">{trip.driverName}</div>
                        <div className="text-[10px] text-slate-500">{trip.shift.split('(')[0]}</div>
                      </td>

                      {/* Route */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900">
                          {trip.routeFrom} <span className="text-amber-600">⇄</span> {trip.routeTo}
                        </div>
                        {trip.viaOrArea && (
                          <div className="text-[10px] text-slate-500 truncate max-w-[180px]">
                            via {trip.viaOrArea}
                          </div>
                        )}
                      </td>

                      {/* Start KM */}
                      <td className="py-3 px-4 font-mono text-slate-700 whitespace-nowrap">
                        {trip.startKm.toLocaleString()}
                      </td>

                      {/* End KM */}
                      <td className="py-3 px-4 font-mono text-slate-700 whitespace-nowrap">
                        {trip.endKm.toLocaleString()}
                      </td>

                      {/* Total KM */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 text-xs">
                          {trip.totalKm} KM
                        </span>
                      </td>

                      {/* Fuel & Toll */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {trip.fuelLitres && trip.fuelLitres > 0 ? (
                          <div className="text-orange-700 font-mono text-[11px] font-semibold">
                            {trip.fuelLitres}L ({formatCurrency(trip.fuelCost || 0)})
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}
                      </td>

                      {/* Purpose */}
                      <td className="py-3 px-4 max-w-[200px]">
                        <div className="truncate text-slate-900" title={trip.purpose}>
                          {trip.purpose}
                        </div>
                        {trip.officerOrDept && (
                          <div className="text-[10px] text-slate-500 truncate">{trip.officerOrDept}</div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100">
                          <button
                            onClick={() => onDuplicateTrip(trip)}
                            title="Duplicate this trip entry for today"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onEditTrip(trip)}
                            title="Edit trip record"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-slate-100 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteTrip(trip.id)}
                            title="Delete trip record"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Table Footer with Summary */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
          <div>
            Showing <strong className="text-slate-900">{displayedTrips.length}</strong> of{' '}
            <strong className="text-slate-900">{trips.length}</strong> total trips logged in database
          </div>
          <div className="font-mono text-amber-700 font-bold">
            Total Distance in Selected Range: {stats.totalKm.toLocaleString()} KM
          </div>
        </div>
      </div>

      {/* Official Print Modal / Printable Certificate */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white text-slate-900 rounded-xl shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto print:p-0 print:shadow-none">
            {/* Modal close & print bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6 print:hidden">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-base text-slate-900">
                  Print Preview: Office Transport Trip Certificate
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-4 h-4" />
                  Print Document
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Report Document Body */}
            <div className="space-y-6 text-slate-900">
              {/* Header */}
              <div className="text-center border-b-2 border-slate-900 pb-4">
                <h2 className="text-xl font-black uppercase tracking-wide">
                  SANDUR - DONIMALAI OFFICE TRANSPORT FLEET
                </h2>
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mt-1">
                  HIRED VEHICLE LOGBOOK & KM CERTIFICATE
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Corridor: Sandur Head Office ⇄ Donimalai Township & Mines Area
                </p>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-3 bg-slate-50 border border-slate-300 rounded-lg text-xs">
                <div>
                  <span className="text-slate-500 block">Period From:</span>
                  <strong className="font-mono text-slate-900">{formatDateDisplay(startDate)}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Period To:</span>
                  <strong className="font-mono text-slate-900">{formatDateDisplay(endDate)}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Vehicle Filter:</span>
                  <strong className="text-slate-900">{selectedVehicleName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Generated On:</span>
                  <strong className="font-mono text-slate-900">{getTodayString()}</strong>
                </div>
              </div>

              {/* Executive Summary Stats */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs border border-slate-300 rounded-lg divide-x divide-slate-300">
                <div className="p-2.5">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Total Distance</span>
                  <span className="text-base font-black font-mono text-slate-900">{stats.totalKm} KM</span>
                </div>
                <div className="p-2.5">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Total Trips</span>
                  <span className="text-base font-black font-mono text-slate-900">{stats.totalTrips}</span>
                </div>
                <div className="p-2.5">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Operating Days</span>
                  <span className="text-base font-black font-mono text-slate-900">{stats.operatingDays}</span>
                </div>
                <div className="p-2.5">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Est. Bill Amount</span>
                  <span className="text-base font-black font-mono text-slate-900">{formatCurrency(stats.estimatedHireCost)}</span>
                </div>
              </div>

              {/* Itemized Table */}
              <table className="w-full text-left text-[11px] border border-slate-300 divide-y divide-slate-300">
                <thead className="bg-slate-100 font-bold text-slate-700">
                  <tr>
                    <th className="p-2">Date</th>
                    <th className="p-2">Vehicle / Reg</th>
                    <th className="p-2">Site Duty</th>
                    <th className="p-2">Driver</th>
                    <th className="p-2">Route</th>
                    <th className="p-2 text-right">Start KM</th>
                    <th className="p-2 text-right">End KM</th>
                    <th className="p-2 text-right font-black">Total KM</th>
                    <th className="p-2">Purpose / Officer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {displayedTrips.map((t) => (
                    <tr key={t.id}>
                      <td className="p-2 whitespace-nowrap font-mono">{t.date}</td>
                      <td className="p-2 font-mono">{t.vehicleReg} ({t.vehicleModel.split(' ')[1]})</td>
                      <td className="p-2 font-mono font-bold text-slate-900">{t.destinationSite || 'DIOM'}</td>
                      <td className="p-2">{t.driverName}</td>
                      <td className="p-2">{t.routeFrom} ⇄ {t.routeTo}</td>
                      <td className="p-2 text-right font-mono">{t.startKm}</td>
                      <td className="p-2 text-right font-mono">{t.endKm}</td>
                      <td className="p-2 text-right font-mono font-bold">{t.totalKm}</td>
                      <td className="p-2 truncate max-w-[150px]">{t.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Signatures */}
              <div className="pt-8 grid grid-cols-3 gap-6 text-center text-xs">
                <div className="border-t border-slate-400 pt-2">
                  <span className="font-bold block">Driver / Transporter</span>
                  <span className="text-slate-500 text-[10px]">(Signature & Date)</span>
                </div>
                <div className="border-t border-slate-400 pt-2">
                  <span className="font-bold block">Transport Supervisor</span>
                  <span className="text-slate-500 text-[10px]">(Verified Distance)</span>
                </div>
                <div className="border-t border-slate-400 pt-2">
                  <span className="font-bold block">Administrative Officer</span>
                  <span className="text-slate-500 text-[10px]">(Approved for Payment)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
};
