import React, { useState, useEffect } from 'react';
import { Vehicle, TripLog, ShiftType, OperationalSite, OPERATIONAL_SITES, DEFAULT_DIESEL_PRICE } from '../types/fleet';
import { getTodayString } from '../utils/dateUtils';
import {
  Calendar,
  Truck,
  Car,
  Clock,
  Gauge,
  MapPin,
  Fuel,
  Receipt,
  User,
  CheckCircle2,
  AlertCircle,
  FileText,
  RotateCcw,
  Building,
  Pickaxe,
  Factory,
  Sparkles,
} from 'lucide-react';

interface TripEntryFormProps {
  vehicles: Vehicle[];
  onSaveTrip: (tripData: Omit<TripLog, 'id' | 'createdAt'>) => void;
  onCancel?: () => void;
  initialData?: TripLog | null;
  defaultVehicleId?: string;
  defaultDate?: string;
}

const SHIFT_OPTIONS: ShiftType[] = [
  'General Shift (09:00 - 18:00)',
  'Morning Shift (06:00 - 14:00)',
  'Evening Shift (14:00 - 22:00)',
  'Night Shift (22:00 - 06:00)',
  'Full Day / Multi-Trip',
  'Emergency / Special Duty',
];

export const TripEntryForm: React.FC<TripEntryFormProps> = ({
  vehicles,
  onSaveTrip,
  onCancel,
  initialData,
  defaultVehicleId,
  defaultDate,
}) => {
  const [date, setDate] = useState<string>(initialData?.date || defaultDate || getTodayString());
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    initialData?.vehicleId || defaultVehicleId || (vehicles[0]?.id ?? '')
  );

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  const [driverName, setDriverName] = useState<string>(
    initialData?.driverName || selectedVehicle?.driverName || ''
  );

  // Operational Site (DIOM, KIOM, PPT, Admin Building)
  const [destinationSite, setDestinationSite] = useState<OperationalSite>(
    initialData?.destinationSite || 'DIOM'
  );

  const [routeFrom, setRouteFrom] = useState<string>(initialData?.routeFrom || 'Sandur Head Office');
  const [routeTo, setRouteTo] = useState<string>(
    initialData?.routeTo || 'DIOM (Donimalai Iron Ore Mine)'
  );
  const [viaOrArea, setViaOrArea] = useState<string>(
    initialData?.viaOrArea || 'Mine Benches & Weighbridge'
  );
  const [shift, setShift] = useState<ShiftType>(
    initialData?.shift || 'General Shift (09:00 - 18:00)'
  );
  const [startTime, setStartTime] = useState<string>(initialData?.startTime || '08:30');
  const [endTime, setEndTime] = useState<string>(initialData?.endTime || '17:30');

  // Odometer readings
  const [startKm, setStartKm] = useState<number>(
    initialData?.startKm ?? (selectedVehicle?.currentOdometer || 0)
  );
  const [endKm, setEndKm] = useState<number>(
    initialData?.endKm ?? ((selectedVehicle?.currentOdometer || 0) + 40)
  );

  // Additional details
  const [purpose, setPurpose] = useState<string>(
    initialData?.purpose || 'Office staff transport & routine transit'
  );
  const [officerOrDept, setOfficerOrDept] = useState<string>(
    initialData?.officerOrDept || 'Administrative Services'
  );
  const [fuelLitres, setFuelLitres] = useState<string>(
    initialData?.fuelLitres ? String(initialData.fuelLitres) : ''
  );
  const [fuelCost, setFuelCost] = useState<string>(
    initialData?.fuelCost ? String(initialData.fuelCost) : ''
  );
  const [tollOrOtherExpenses, setTollOrOtherExpenses] = useState<string>(
    initialData?.tollOrOtherExpenses ? String(initialData.tollOrOtherExpenses) : ''
  );
  const [voucherNumber, setVoucherNumber] = useState<string>(
    initialData?.voucherNumber ||
      `LOG-${date.replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`
  );
  const [remarks, setRemarks] = useState<string>(initialData?.remarks || '');

  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // When vehicle changes, auto-populate driver and current odometer if creating new
  useEffect(() => {
    if (!initialData && selectedVehicle) {
      setDriverName(selectedVehicle.driverName);
      setStartKm(selectedVehicle.currentOdometer);
      setEndKm(selectedVehicle.currentOdometer + 40);
    }
  }, [selectedVehicleId, initialData]);

  // Handle destination site change
  const handleSiteSelect = (site: OperationalSite) => {
    setDestinationSite(site);
    if (site === 'DIOM') {
      setRouteTo('DIOM (Donimalai Iron Ore Mine)');
      setViaOrArea('Mine Pit, Benches & Excavation Area');
      setPurpose('DIOM mine staff & operations transit');
      setEndKm(startKm + 42);
    } else if (site === 'KIOM') {
      setRouteTo('KIOM (Kumaraswamy Iron Ore Mine)');
      setViaOrArea('Kumaraswamy Hilltop & Mines');
      setPurpose('KIOM site inspection & engineering visit');
      setEndKm(startKm + 46);
    } else if (site === 'PPT') {
      setRouteTo('PPT (Pellet Plant / Plant Area)');
      setViaOrArea('Screening Plant, Workshop & Siding');
      setPurpose('PPT mechanical spares and plant crew');
      setEndKm(startKm + 36);
    } else if (site === 'Admin Building') {
      setRouteTo('Stay at Admin Building');
      setViaOrArea('Administrative Block & Head Office');
      setPurpose('Stay at Admin Building for office & local duty');
      setEndKm(startKm + 18);
    }
  };

  // Total KM calculation
  const totalKmCalculated = Math.max(0, endKm - startKm);
  const isKmInvalid = endKm < startKm;

  const handleQuickAddKm = (add: number) => {
    setEndKm(startKm + add);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedVehicle) {
      setFormError('Please select a vehicle.');
      return;
    }

    if (!date) {
      setFormError('Please select a valid date for this trip entry.');
      return;
    }

    if (isKmInvalid) {
      setFormError('Ending Odometer cannot be less than Starting Odometer!');
      return;
    }

    if (totalKmCalculated <= 0) {
      setFormError('Total KM must be greater than zero.');
      return;
    }

    if (!driverName.trim()) {
      setFormError('Driver name is required.');
      return;
    }

    const payload: Omit<TripLog, 'id' | 'createdAt'> = {
      date,
      vehicleId: selectedVehicle.id,
      vehicleReg: selectedVehicle.regNumber,
      vehicleModel: selectedVehicle.model,
      driverName: driverName.trim(),
      destinationSite,
      routeFrom: routeFrom.trim() || 'Sandur Head Office',
      routeTo: routeTo.trim() || destinationSite,
      viaOrArea: viaOrArea.trim(),
      shift,
      startTime,
      endTime,
      startKm: Number(startKm),
      endKm: Number(endKm),
      totalKm: totalKmCalculated,
      purpose: purpose.trim(),
      officerOrDept: officerOrDept.trim(),
      fuelLitres: fuelLitres ? parseFloat(fuelLitres) : 0,
      fuelCost: fuelCost ? parseFloat(fuelCost) : 0,
      tollOrOtherExpenses: tollOrOtherExpenses ? parseFloat(tollOrOtherExpenses) : 0,
      remarks: remarks.trim(),
      voucherNumber: voucherNumber.trim(),
    };

    onSaveTrip(payload);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Alert Banners */}
      {formError && (
        <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{formError}</span>
        </div>
      )}

      {isSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>Trip log successfully saved for {date}!</span>
        </div>
      )}

      {/* Section 1: Date & Vehicle Selector */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              1. Date of Entry & Vehicle Assignment
            </h3>
            <p className="text-xs text-slate-500">Select the date of journey and one of the 3 hired vehicles</p>
          </div>
          {/* Quick Date buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setDate(getTodayString())}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                date === getTodayString()
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => {
                const y = new Date();
                y.setDate(y.getDate() - 1);
                const yStr = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, '0')}-${String(
                  y.getDate()
                ).padStart(2, '0')}`;
                setDate(yStr);
              }}
              className="px-2.5 py-1 rounded text-xs font-semibold bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 transition-all"
            >
              Yesterday
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Trip Date <span className="text-amber-600">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Manual daily record for office transport</p>
          </div>

          {/* Shift */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Shift Duty</label>
            <select
              value={shift}
              onChange={(e) => setShift(e.target.value as ShiftType)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
            >
              {SHIFT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Time range */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Shift Timings (Departure - Arrival)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* 3 Vehicle Selection Cards */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Select Hired Vehicle <span className="text-amber-600">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {vehicles.map((v) => {
              const isSelected = v.id === selectedVehicleId;
              const isBolero = v.model === 'Mahindra Bolero';
              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVehicleId(v.id)}
                  className={`relative p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/30 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-2 rounded-lg ${
                          isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {isBolero ? <Car className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900">{v.nickName}</div>
                        <div className="text-xs font-mono font-semibold text-amber-700">{v.regNumber}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-200 text-xs flex justify-between items-center text-slate-500">
                    <span>Driver: <strong className="text-slate-800">{v.driverName}</strong></span>
                    <span className="font-mono text-slate-700">{v.currentOdometer.toLocaleString()} KM</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section 2: Odometer Readings & KM Calculation */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-amber-600" />
              2. Odometer Readings & Distance (KM)
            </h3>
            <p className="text-xs text-slate-500">
              Enter Start and End odometer to calculate total KM automatically
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 block">Total Distance</span>
            <span
              className={`text-xl sm:text-2xl font-black font-mono ${
                isKmInvalid ? 'text-rose-600' : 'text-amber-700'
              }`}
            >
              {isKmInvalid ? 'Invalid KM' : `${totalKmCalculated} KM`}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-center">
          {/* Start KM */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Start Odometer (KM) <span className="text-amber-600">*</span></span>
              {selectedVehicle && (
                <button
                  type="button"
                  onClick={() => setStartKm(selectedVehicle.currentOdometer)}
                  className="text-[11px] text-amber-700 hover:underline flex items-center gap-1 font-medium"
                >
                  <RotateCcw className="w-3 h-3" /> Sync last ({selectedVehicle.currentOdometer})
                </button>
              )}
            </label>
            <input
              type="number"
              required
              min={0}
              value={startKm}
              onChange={(e) => setStartKm(Number(e.target.value))}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-base font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* End KM */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              End Odometer (KM) <span className="text-amber-600">*</span>
            </label>
            <input
              type="number"
              required
              min={startKm}
              value={endKm}
              onChange={(e) => setEndKm(Number(e.target.value))}
              className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-base font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 ${
                isKmInvalid
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500 text-rose-600'
                  : 'border-slate-300 focus:border-amber-500 focus:ring-amber-500'
              }`}
            />
          </div>

          {/* Quick KM Adder buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 font-medium">
              Quick Add Distance to End KM
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickAddKm(16)}
                className="px-2 py-1.5 bg-white border border-slate-300 hover:border-amber-500 rounded-lg text-xs font-mono text-slate-700 hover:text-amber-700 hover:bg-amber-50"
              >
                +16 km (1-way)
              </button>
              <button
                type="button"
                onClick={() => handleQuickAddKm(32)}
                className="px-2 py-1.5 bg-white border border-slate-300 hover:border-amber-500 rounded-lg text-xs font-mono text-slate-700 hover:text-amber-700 hover:bg-amber-50"
              >
                +32 km (Township)
              </button>
              <button
                type="button"
                onClick={() => handleQuickAddKm(36)}
                className="px-2 py-1.5 bg-white border border-slate-300 hover:border-amber-500 rounded-lg text-xs font-mono text-slate-700 hover:text-amber-700 hover:bg-amber-50"
              >
                +36 km (Workshop)
              </button>
              <button
                type="button"
                onClick={() => handleQuickAddKm(42)}
                className="px-2 py-1.5 bg-white border border-slate-300 hover:border-amber-500 rounded-lg text-xs font-mono text-slate-700 hover:text-amber-700 hover:bg-amber-50"
              >
                +42 km (Mines)
              </button>
              <button
                type="button"
                onClick={() => handleQuickAddKm(70)}
                className="px-2 py-1.5 bg-white border border-slate-300 hover:border-amber-500 rounded-lg text-xs font-mono text-slate-700 hover:text-amber-700 hover:bg-amber-50"
              >
                +70 km (2 Trips)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Operational Site Duty Selection (DIOM, KIOM, PPT, Stay at Admin Building) */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="pb-3 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600" />
              3. Operational Site Duty Selection <span className="text-amber-600">*</span>
            </h3>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-200">
              Selected: {destinationSite}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Select whether the hired vehicle went to DIOM, KIOM, PPT, or stayed at the Admin Building
          </p>
        </div>

        {/* 4 Primary Operational Site Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {OPERATIONAL_SITES.map((site) => {
            const isSelected = destinationSite === site.id;
            return (
              <div
                key={site.id}
                onClick={() => handleSiteSelect(site.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/40 shadow-xs'
                    : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-xs font-black font-mono px-2 py-0.5 rounded ${
                        site.id === 'DIOM'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : site.id === 'KIOM'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : site.id === 'PPT'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {site.id}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-amber-600 stroke-[2.5]" />
                    )}
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">{site.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">{site.shortDesc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Route Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              From Location <span className="text-amber-600">*</span>
            </label>
            <input
              type="text"
              required
              value={routeFrom}
              onChange={(e) => setRouteFrom(e.target.value)}
              placeholder="e.g. Sandur Head Office"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              To Location / Site <span className="text-amber-600">*</span>
            </label>
            <input
              type="text"
              required
              value={routeTo}
              onChange={(e) => setRouteTo(e.target.value)}
              placeholder="e.g. DIOM / KIOM / PPT / Admin Building"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Via / Area Covered</label>
            <input
              type="text"
              value={viaOrArea}
              onChange={(e) => setViaOrArea(e.target.value)}
              placeholder="e.g. Benches, Screening, Admin Complex"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Trip Purpose / Duty Details
            </label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Staff pickup & drop / Site inspection / Spare parts"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Department / Officer in Charge
            </label>
            <input
              type="text"
              value={officerOrDept}
              onChange={(e) => setOfficerOrDept(e.target.value)}
              placeholder="e.g. Administration, Mining Engineers, Plant"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Section 4: Driver, Expenses & Fuel (Optional details) */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="pb-3 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Fuel className="w-4 h-4 text-amber-600" />
            4. Driver Details & Fuel / Expenses (Optional)
          </h3>
          <p className="text-xs text-slate-500">Record driver verification, fuel refills, and toll slips</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Driver Name <span className="text-amber-600">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="Driver Name"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Fuel Cost (₹ Paid)
              </label>
              <span className="text-[10px] text-orange-600 font-mono font-semibold">₹100.04/L</span>
            </div>
            <input
              type="number"
              min={0}
              value={fuelCost}
              onChange={(e) => {
                const val = e.target.value;
                setFuelCost(val);
                const num = parseFloat(val);
                if (num > 0) {
                  const calculated = Math.round((num / DEFAULT_DIESEL_PRICE) * 100) / 100;
                  setFuelLitres(String(calculated));
                } else {
                  setFuelLitres('');
                }
              }}
              placeholder="e.g. 2500"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-500 font-mono"
            />
            {/* Quick Round Figure Buttons */}
            <div className="flex flex-wrap gap-1 mt-1.5">
              {[1000, 2000, 2500, 3000, 4000].map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => {
                    setFuelCost(String(amt));
                    const calculated = Math.round((amt / DEFAULT_DIESEL_PRICE) * 100) / 100;
                    setFuelLitres(String(calculated));
                  }}
                  className="px-1.5 py-0.5 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-[10px] font-mono transition-colors"
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Exact Fuel (Litres)
              </label>
              {fuelCost && parseFloat(fuelCost) > 0 && (
                <span className="text-[10px] text-emerald-700 font-mono font-semibold">Auto-calculated</span>
              )}
            </div>
            <input
              type="number"
              step="0.01"
              min={0}
              value={fuelLitres}
              onChange={(e) => {
                const val = e.target.value;
                setFuelLitres(val);
                const num = parseFloat(val);
                if (num > 0) {
                  const calculatedCost = Math.round(num * DEFAULT_DIESEL_PRICE);
                  setFuelCost(String(calculatedCost));
                }
              }}
              placeholder="0.00 L"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-orange-600 font-bold focus:outline-none focus:border-amber-500 font-mono"
            />
            {fuelCost && parseFloat(fuelCost) > 0 && fuelLitres && (
              <p className="text-[10px] text-slate-500 mt-1 font-mono">
                ₹{Number(fuelCost).toLocaleString()} ÷ ₹{DEFAULT_DIESEL_PRICE}/L = {fuelLitres} L
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Toll / Parking / Other (₹)
            </label>
            <input
              type="number"
              min={0}
              value={tollOrOtherExpenses}
              onChange={(e) => setTollOrOtherExpenses(e.target.value)}
              placeholder="₹ 0"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Logbook Voucher / Slip Ref No
            </label>
            <input
              type="text"
              value={voucherNumber}
              onChange={(e) => setVoucherNumber(e.target.value)}
              placeholder="e.g. LOG-2026-0929-01"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-500 font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Remarks / Transport Incharge Note
            </label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Vehicle washed, returned on time, approved"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-semibold transition-all"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl shadow-xs text-sm transition-all transform active:scale-95"
        >
          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
          <span>Save Trip Log ({totalKmCalculated} KM)</span>
        </button>
      </div>
    </form>
  );
};
