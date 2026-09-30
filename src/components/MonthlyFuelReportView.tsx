import React, { useState, useMemo } from 'react';
import {
  Vehicle,
  TripLog,
  FuelLog,
  MonthlyFleetFuelSummary,
  DEFAULT_DIESEL_PRICE,
} from '../types/fleet';
import {
  aggregateMonthlyFuelData,
  exportMonthlyFuelCSV,
  calculateExactFuelFromAmount,
} from '../utils/fuelUtils';
import { formatCurrency, formatDateDisplay, formatKm } from '../utils/dateUtils';
import {
  Fuel,
  PlusCircle,
  Download,
  Printer,
  Calendar,
  Truck,
  Car,
  TrendingUp,
  Receipt,
  Search,
  Filter,
  Trash2,
  Calculator,
  ArrowRight,
  X,
  Gauge,
  Sparkles,
} from 'lucide-react';

interface MonthlyFuelReportViewProps {
  vehicles: Vehicle[];
  trips: TripLog[];
  fuelLogs: FuelLog[];
  onOpenAddFuelModal: (vehicleId?: string) => void;
  onDeleteFuelLog: (logId: string) => void;
}

export const MonthlyFuelReportView: React.FC<MonthlyFuelReportViewProps> = ({
  vehicles,
  trips,
  fuelLogs,
  onOpenAddFuelModal,
  onDeleteFuelLog,
}) => {
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<string>('all');
  const [selectedVehicleFilter, setSelectedVehicleFilter] = useState<string>('all');
  const [searchSlipQuery, setSearchSlipQuery] = useState<string>('');
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  // Compute monthly aggregated statistics
  const monthlySummaries = useMemo(() => {
    return aggregateMonthlyFuelData(fuelLogs, trips, vehicles);
  }, [fuelLogs, trips, vehicles]);

  // Filtered monthly summaries for display
  const displayedSummaries = useMemo(() => {
    if (selectedMonthFilter === 'all') {
      return monthlySummaries;
    }
    return monthlySummaries.filter((m) => m.monthKey === selectedMonthFilter);
  }, [monthlySummaries, selectedMonthFilter]);

  // Cumulative all-time totals
  const totalLitresAllTime = useMemo(() => {
    return monthlySummaries.reduce((acc, m) => acc + m.totalFleetLitres, 0);
  }, [monthlySummaries]);

  const totalCostAllTime = useMemo(() => {
    return monthlySummaries.reduce((acc, m) => acc + m.totalFleetFuelCost, 0);
  }, [monthlySummaries]);

  const totalKmAllTime = useMemo(() => {
    return monthlySummaries.reduce((acc, m) => acc + m.totalFleetKm, 0);
  }, [monthlySummaries]);

  const overallMileageAllTime =
    totalLitresAllTime > 0 ? (totalKmAllTime / totalLitresAllTime).toFixed(2) : '0';

  // Filtered refuel transaction logs for the logbook table
  const filteredFuelLogs = useMemo(() => {
    return fuelLogs.filter((f) => {
      if (selectedMonthFilter !== 'all' && !f.date.startsWith(selectedMonthFilter)) {
        return false;
      }
      if (selectedVehicleFilter !== 'all' && f.vehicleId !== selectedVehicleFilter) {
        return false;
      }
      if (searchSlipQuery.trim()) {
        const q = searchSlipQuery.toLowerCase().trim();
        const matches =
          f.driverName.toLowerCase().includes(q) ||
          f.vehicleReg.toLowerCase().includes(q) ||
          f.fuelBunk.toLowerCase().includes(q) ||
          (f.slipNumber && f.slipNumber.toLowerCase().includes(q)) ||
          (f.remarks && f.remarks.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [fuelLogs, selectedMonthFilter, selectedVehicleFilter, searchSlipQuery]);

  const handleExportCSV = () => {
    exportMonthlyFuelCSV(displayedSummaries);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold">
              <Fuel className="w-3.5 h-3.5 text-orange-600" />
              Monthly Fuel Consumption & Cost Monitor • Rate: ₹{DEFAULT_DIESEL_PRICE}/L
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Monthly Vehicle Fuel & Cost Accounting
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Summarizing diesel consumption, round figure expenses, exact fuel calculated at{' '}
              <strong className="text-orange-600 font-mono">₹100.04 per litre</strong>, and mileage
              for each of the 3 Mahindra vehicles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onOpenAddFuelModal()}
              className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-xs text-xs sm:text-sm transition-all transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Add Fuel Refill (₹100.04/L)</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs sm:text-sm font-semibold transition-all shadow-xs"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Export Monthly CSV</span>
            </button>

            <button
              onClick={() => setShowPrintModal(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs sm:text-sm font-semibold transition-all shadow-xs"
            >
              <Printer className="w-4 h-4 text-sky-600" />
              <span>Print Statement</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>Total Diesel Consumed</span>
            <Fuel className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-orange-600 tracking-tight">
            {totalLitresAllTime.toFixed(2)}
            <span className="text-xs font-normal text-slate-500 ml-1">Litres</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Calculated at ₹100.04/L</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>Total Fuel Expense</span>
            <Receipt className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-700 tracking-tight">
            {formatCurrency(totalCostAllTime)}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Round figure vouchers</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>Total Distance Driven</span>
            <Gauge className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 tracking-tight">
            {totalKmAllTime.toLocaleString()}
            <span className="text-xs font-normal text-slate-500 ml-1">KM</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Sandur & Mines corridor</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>Fleet Average Mileage</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-amber-700 tracking-tight">
            {overallMileageAllTime}
            <span className="text-xs font-normal text-slate-500 ml-1">km/L</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Overall diesel economy</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-500 font-semibold flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5 text-orange-600" />
            Filter Month:
          </span>
          <button
            onClick={() => setSelectedMonthFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedMonthFilter === 'all'
                ? 'bg-orange-500 text-slate-950 font-bold shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            All Months ({monthlySummaries.length})
          </button>
          {monthlySummaries.map((m) => (
            <button
              key={m.monthKey}
              onClick={() => setSelectedMonthFilter(m.monthKey)}
              className={`px-3 py-1.5 rounded-lg font-mono font-medium transition-all ${
                selectedMonthFilter === m.monthKey
                  ? 'bg-orange-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {m.monthName}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedVehicleFilter}
            onChange={(e) => setSelectedVehicleFilter(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-slate-900 focus:outline-none focus:border-orange-500"
          >
            <option value="all">All 3 Vehicles</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.nickName} ({v.regNumber})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary Monthly Aggregation Tables */}
      <div className="space-y-6">
        {displayedSummaries.map((summary) => (
          <div
            key={summary.monthKey}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs"
          >
            {/* Month Header Banner */}
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    {summary.monthName} • Fuel Consumption & Cost Summary
                  </h3>
                  <p className="text-xs text-slate-500">
                    Aggregated vehicle performance for {summary.monthName}
                  </p>
                </div>
              </div>

              {/* Month Fleet Badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs">
                  Total Distance: <strong className="text-slate-900">{summary.totalFleetKm} KM</strong>
                </span>
                <span className="px-3 py-1 rounded-lg bg-orange-50 border border-orange-200 text-orange-800">
                  Total Fuel: <strong>{summary.totalFleetLitres} L</strong>
                </span>
                <span className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
                  Total Cost: <strong>{formatCurrency(summary.totalFleetFuelCost)}</strong>
                </span>
                <span className="px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
                  Avg Mileage: <strong>{summary.overallFleetMileage} km/L</strong>
                </span>
              </div>
            </div>

            {/* Vehicle Breakdown Table for this month */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Vehicle</th>
                    <th className="py-3 px-4">Model & Reg</th>
                    <th className="py-3 px-4">Refuels Count</th>
                    <th className="py-3 px-4 text-right">Distance (KM)</th>
                    <th className="py-3 px-4 text-right text-orange-600 font-bold">
                      Diesel Filled (Litres)
                    </th>
                    <th className="py-3 px-4 text-right text-emerald-700 font-bold">
                      Total Fuel Cost (₹)
                    </th>
                    <th className="py-3 px-4 text-right text-amber-700 font-bold">
                      Average Mileage (KM/L)
                    </th>
                    <th className="py-3 px-4 text-right font-mono">Fuel Cost / KM</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {summary.vehicleStats
                    .filter((vs) => selectedVehicleFilter === 'all' || vs.vehicleId === selectedVehicleFilter)
                    .map((vs) => {
                      const isCamper = vs.vehicleModel === 'Mahindra Camper';
                      return (
                        <tr key={vs.vehicleId} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span
                                className={`p-1.5 rounded-lg ${
                                  isCamper
                                    ? 'bg-amber-100 text-amber-800'
                                    : vs.vehicleReg.includes('4821')
                                    ? 'bg-sky-100 text-sky-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {isCamper ? <Truck className="w-4 h-4" /> : <Car className="w-4 h-4" />}
                              </span>
                              <span className="font-bold text-slate-900">{vs.vehicleNickName}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-600">
                            {vs.vehicleReg}
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                            <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-slate-700">
                              {vs.refuelCount} refill{vs.refuelCount !== 1 ? 's' : ''}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-800">
                            {vs.totalKmRun.toLocaleString()} KM
                          </td>

                          <td className="py-3.5 px-4 text-right font-mono font-black text-orange-600 text-sm">
                            {vs.totalFuelLitres.toFixed(2)} L
                          </td>

                          <td className="py-3.5 px-4 text-right font-mono font-black text-emerald-700 text-sm">
                            {formatCurrency(vs.totalFuelCost)}
                          </td>

                          <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-700">
                            {vs.averageMileageKmPerLitre > 0
                              ? `${vs.averageMileageKmPerLitre.toFixed(2)} km/L`
                              : '-'}
                          </td>

                          <td className="py-3.5 px-4 text-right font-mono text-slate-600">
                            {vs.costPerKm > 0 ? `₹${vs.costPerKm.toFixed(2)}/km` : '-'}
                          </td>

                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => onOpenAddFuelModal(vs.vehicleId)}
                              className="px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs transition-colors border border-orange-200"
                            >
                              + Add Fuel
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                  {/* Month Fleet Total Row */}
                  <tr className="bg-slate-50/90 font-bold border-t-2 border-slate-200 text-slate-900">
                    <td className="py-3.5 px-4">FLEET TOTAL ({summary.monthName})</td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono">3 Vehicles</td>
                    <td className="py-3.5 px-4 font-mono">
                      {summary.vehicleStats.reduce((a, b) => a + b.refuelCount, 0)} Total Refuels
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono">{summary.totalFleetKm} KM</td>
                    <td className="py-3.5 px-4 text-right font-mono text-orange-600 text-sm">
                      {summary.totalFleetLitres.toFixed(2)} L
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-emerald-700 text-sm">
                      {formatCurrency(summary.totalFleetFuelCost)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-amber-700">
                      {summary.overallFleetMileage.toFixed(2)} km/L
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono">
                      ₹{summary.overallCostPerKm.toFixed(2)}/km
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Fuel Refill Transaction Logbook Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs space-y-3">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-orange-600" />
              Diesel Refill Slips & Receipt Log ({filteredFuelLogs.length} Entries)
            </h3>
            <p className="text-xs text-slate-500">
              Itemized refueling transactions showing round figure payments and exact calculated litres
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search slip, bunk, driver..."
                value={searchSlipQuery}
                onChange={(e) => setSearchSlipQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 w-44 sm:w-60"
              />
            </div>

            <button
              onClick={() => onOpenAddFuelModal()}
              className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Fuel</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Date & Slip No</th>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Driver</th>
                <th className="py-3 px-4">Odometer</th>
                <th className="py-3 px-4 font-bold text-emerald-700">Amount Paid (Round Fig)</th>
                <th className="py-3 px-4 font-bold text-orange-600">Exact Fuel (Litres)</th>
                <th className="py-3 px-4">Unit Rate</th>
                <th className="py-3 px-4">Fuel Station & Payment</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFuelLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-bold text-slate-900">{formatDateDisplay(log.date)}</div>
                    <div className="text-[10px] text-orange-700 font-mono">{log.slipNumber || '-'}</div>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-semibold text-slate-900">{log.vehicleModel}</span>{' '}
                    <span className="font-mono text-slate-500 text-[11px]">({log.vehicleReg})</span>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap text-slate-700">{log.driverName}</td>

                  <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-700">
                    {log.odometerAtRefuel.toLocaleString()} KM
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap font-mono font-black text-emerald-700 text-sm">
                    {formatCurrency(log.amountPaid)}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap font-mono font-black text-orange-600 text-sm">
                    {log.exactLitres.toFixed(2)} Litres
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-500">
                    ₹{log.pricePerLitre.toFixed(2)}/L
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-slate-900 font-medium truncate max-w-[200px]">{log.fuelBunk}</div>
                    <div className="text-[10px] text-slate-500">{log.paymentMethod}</div>
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => onDeleteFuelLog(log.id)}
                      title="Delete refuel log"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Monthly Fuel Accounting Print Statement Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white text-slate-900 rounded-xl shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto print:p-0 print:shadow-none">
            {/* Close & Print Action bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6 print:hidden">
              <div className="flex items-center gap-2">
                <Fuel className="w-5 h-5 text-orange-600" />
                <h3 className="font-bold text-base text-slate-900">
                  Print Preview: Official Monthly Fuel Statement
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
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

            {/* Document Content */}
            <div className="space-y-6 text-slate-900">
              <div className="text-center border-b-2 border-slate-900 pb-4">
                <h2 className="text-xl font-black uppercase tracking-wide">
                  SANDUR - DONIMALAI OFFICE TRANSPORT FLEET
                </h2>
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mt-1">
                  MONTHLY VEHICLE FUEL CONSUMPTION & EXPENDITURE STATEMENT
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Calculated based on Diesel Tariff @ ₹{DEFAULT_DIESEL_PRICE} / Litre (Round Figure Fuel Accounting)
                </p>
              </div>

              {/* Multi-month or Selected Month Summary */}
              {displayedSummaries.map((sum) => (
                <div key={sum.monthKey} className="space-y-3 pt-2">
                  <div className="flex justify-between items-center bg-slate-100 p-2.5 rounded border border-slate-300 text-xs font-bold">
                    <span>Month: {sum.monthName}</span>
                    <span className="font-mono">
                      Fleet Distance: {sum.totalFleetKm} KM • Total Diesel: {sum.totalFleetLitres} L • Expense: {formatCurrency(sum.totalFleetFuelCost)}
                    </span>
                  </div>

                  <table className="w-full text-left text-xs border border-slate-300 divide-y divide-slate-300">
                    <thead className="bg-slate-50 font-bold text-slate-700">
                      <tr>
                        <th className="p-2">Vehicle</th>
                        <th className="p-2">Reg No</th>
                        <th className="p-2 text-right">Distance (KM)</th>
                        <th className="p-2 text-right">Diesel Filled</th>
                        <th className="p-2 text-right">Total Fuel Cost</th>
                        <th className="p-2 text-right">Average Mileage</th>
                        <th className="p-2 text-right">Cost / KM</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {sum.vehicleStats.map((vs) => (
                        <tr key={vs.vehicleId}>
                          <td className="p-2 font-semibold">{vs.vehicleNickName}</td>
                          <td className="p-2 font-mono">{vs.vehicleReg}</td>
                          <td className="p-2 text-right font-mono">{vs.totalKmRun} KM</td>
                          <td className="p-2 text-right font-mono font-bold">{vs.totalFuelLitres} L</td>
                          <td className="p-2 text-right font-mono font-bold">{formatCurrency(vs.totalFuelCost)}</td>
                          <td className="p-2 text-right font-mono">{vs.averageMileageKmPerLitre} km/L</td>
                          <td className="p-2 text-right font-mono">₹{vs.costPerKm}/km</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}

              {/* Signatures */}
              <div className="pt-10 grid grid-cols-3 gap-6 text-center text-xs">
                <div className="border-t border-slate-400 pt-2">
                  <span className="font-bold block">Fuel Incharge / Driver</span>
                  <span className="text-slate-500 text-[10px]">(Verified Fuel Slips)</span>
                </div>
                <div className="border-t border-slate-400 pt-2">
                  <span className="font-bold block">Transport Supervisor</span>
                  <span className="text-slate-500 text-[10px]">(Mileage & Odo Checked)</span>
                </div>
                <div className="border-t border-slate-400 pt-2">
                  <span className="font-bold block">Finance & Accounts In-Charge</span>
                  <span className="text-slate-500 text-[10px]">(Approved Fuel Bills)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
