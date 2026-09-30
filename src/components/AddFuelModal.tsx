import React, { useState, useEffect } from 'react';
import { Vehicle, FuelLog, DEFAULT_DIESEL_PRICE } from '../types/fleet';
import { getTodayString } from '../utils/dateUtils';
import { calculateExactFuelFromAmount } from '../utils/fuelUtils';
import {
  Fuel,
  X,
  CheckCircle2,
  Calendar,
  Car,
  Truck,
  IndianRupee,
  Receipt,
  Calculator,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface AddFuelModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  onSaveFuelLog: (logData: Omit<FuelLog, 'id' | 'createdAt'>) => void;
  defaultVehicleId?: string;
}

const ROUND_FIGURE_PRESETS = [1000, 1500, 2000, 2500, 3000, 3500, 4000, 5000];

const FUEL_BUNK_PRESETS = [
  'IOCL Fuel Station, Sandur Main Road',
  'HPCL Station, Sandur Town',
  'NMDC Consumer Pump, Donimalai',
  'BPCL Bunk, Sandur Bypass',
];

export const AddFuelModal: React.FC<AddFuelModalProps> = ({
  isOpen,
  onClose,
  vehicles,
  onSaveFuelLog,
  defaultVehicleId,
}) => {
  const [date, setDate] = useState<string>(getTodayString());
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    defaultVehicleId || vehicles[0]?.id || ''
  );

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  const [driverName, setDriverName] = useState<string>(selectedVehicle?.driverName || '');
  const [odometer, setOdometer] = useState<number>(selectedVehicle?.currentOdometer || 0);

  // Diesel rate: user specified ₹100.04 per litre
  const [pricePerLitre, setPricePerLitre] = useState<number>(DEFAULT_DIESEL_PRICE);

  // Round figure amount normally paid
  const [amountPaid, setAmountPaid] = useState<number>(2500);

  const [fuelBunk, setFuelBunk] = useState<string>('IOCL Fuel Station, Sandur Main Road');
  const [slipNumber, setSlipNumber] = useState<string>(
    `FL-${date.replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`
  );
  const [paymentMethod, setPaymentMethod] = useState<string>('Office Corporate Fuel Card');
  const [remarks, setRemarks] = useState<string>('');

  // Whenever vehicle changes, sync driver and odometer
  useEffect(() => {
    if (selectedVehicle) {
      setDriverName(selectedVehicle.driverName);
      setOdometer(selectedVehicle.currentOdometer);
    }
  }, [selectedVehicleId, selectedVehicle]);

  // Exact fuel calculation
  const { exactLitres, formula } = calculateExactFuelFromAmount(amountPaid, pricePerLitre);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle || amountPaid <= 0) return;

    onSaveFuelLog({
      date,
      vehicleId: selectedVehicle.id,
      vehicleReg: selectedVehicle.regNumber,
      vehicleModel: selectedVehicle.model,
      driverName: driverName.trim(),
      odometerAtRefuel: Number(odometer),
      pricePerLitre: Number(pricePerLitre),
      amountPaid: Number(amountPaid),
      exactLitres,
      fuelBunk: fuelBunk.trim(),
      slipNumber: slipNumber.trim(),
      paymentMethod,
      remarks: remarks.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden my-6 max-h-[92vh] flex flex-col text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-white sticky top-0 z-10">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
              <Fuel className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Add Fuel Refill Entry
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-orange-100 text-orange-900 font-bold border border-orange-200">
                  Rate: ₹{pricePerLitre}/L
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Automatic calculation of exact fuel from round figure payment (₹100.04/L)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* Section 1: Vehicle & Date */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700">
              1. Select Vehicle to Refuel
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {vehicles.map((v) => {
                const isSelected = v.id === selectedVehicleId;
                const isCamper = v.model === 'Mahindra Camper';
                return (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVehicleId(v.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-orange-50/80 border-orange-500 ring-2 ring-orange-500/30 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {isCamper ? (
                        <Truck className="w-4 h-4 text-amber-600" />
                      ) : (
                        <Car className="w-4 h-4 text-sky-600" />
                      )}
                      <span className="font-bold text-xs text-slate-900 truncate">{v.nickName}</span>
                    </div>
                    <div className="font-mono text-[11px] text-amber-700 font-semibold">{v.regNumber}</div>
                    <div className="text-[10px] text-slate-500 mt-1">Odo: {v.currentOdometer.toLocaleString()} KM</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Refuel Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Driver In-Charge</label>
              <input
                type="text"
                required
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Odometer at Refuel (KM)</label>
              <input
                type="number"
                required
                value={odometer}
                onChange={(e) => setOdometer(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 font-mono font-bold focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Section 2: Round Figure Payment & Exact Fuel Calculation */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 via-white to-amber-50 border border-orange-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-orange-200">
              <div className="flex items-center gap-2 text-orange-800 font-bold text-xs">
                <Calculator className="w-4 h-4" />
                <span>2. Round Figure Payment & Exact Fuel Calculation</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <span>Diesel Rate:</span>
                <input
                  type="number"
                  step="0.01"
                  value={pricePerLitre}
                  onChange={(e) => setPricePerLitre(Number(e.target.value))}
                  className="w-20 bg-white border border-orange-300 rounded px-1.5 py-0.5 font-mono text-orange-700 font-bold text-xs focus:outline-none focus:border-orange-500"
                />
                <span className="text-[11px]">₹/L</span>
              </div>
            </div>

            {/* Quick Round Figure Chips */}
            <div>
              <span className="text-xs text-slate-600 block mb-1.5 font-medium">
                Quick Round Figure Paid Amount (Normally Paid):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {ROUND_FIGURE_PRESETS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmountPaid(amt)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      amountPaid === amt
                        ? 'bg-orange-500 text-slate-950 shadow-xs scale-105'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                    }`}
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Paid Input & Exact Litres Result Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Amount Paid (Round Figure in ₹) <span className="text-orange-600">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-500 font-mono">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="1"
                    min="100"
                    required
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(Number(e.target.value))}
                    className="w-full bg-white border border-orange-300 rounded-xl pl-8 pr-3.5 py-2.5 text-base font-mono font-black text-slate-900 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Exact Fuel Display Card */}
              <div className="p-3.5 rounded-xl bg-white border-2 border-orange-300 shadow-xs text-center">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-orange-800 block">
                  Exact Fuel Dispensed
                </span>
                <div className="text-2xl sm:text-3xl font-black font-mono text-orange-600 tracking-tight my-0.5">
                  {exactLitres.toFixed(2)}{' '}
                  <span className="text-sm font-bold text-slate-600">Litres</span>
                </div>
                <div className="text-[11px] font-mono text-slate-500">{formula}</div>
              </div>
            </div>
          </div>

          {/* Section 3: Fuel Station, Slip & Payment Details */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700">
              3. Fuel Bunk & Voucher Details
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1 font-medium">Fuel Station / Bunk</label>
                <select
                  value={fuelBunk}
                  onChange={(e) => setFuelBunk(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                >
                  {FUEL_BUNK_PRESETS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                  <option value="Other Fuel Station">Other Station</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-1 font-medium">
                  Slip Ref / Receipt No
                </label>
                <input
                  type="text"
                  value={slipNumber}
                  onChange={(e) => setSlipNumber(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 font-mono focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1 font-medium">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                >
                  <option value="Office Corporate Fuel Card">Office Corporate Fuel Card</option>
                  <option value="Office Cash Voucher">Office Cash Voucher</option>
                  <option value="NMDC Indent Voucher">NMDC Indent Voucher</option>
                  <option value="Transporter Reimbursable">Transporter Reimbursable</option>
                  <option value="UPI / Online Transfer">UPI / Online Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-1 font-medium">Remarks / Note</label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Tank topped up for night shift"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl shadow-xs text-xs sm:text-sm transition-all transform active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>
                Save Refill ({exactLitres.toFixed(2)} L • ₹{amountPaid.toLocaleString('en-IN')})
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
