import React, { useState, useEffect } from 'react';
import { Vehicle, VehicleModelType } from '../types/fleet';
import { X, Car, Truck, Shield, User, Phone, Gauge, Fuel, Palette, Check, AlertCircle } from 'lucide-react';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicle: Omit<Vehicle, 'id'>, existingId?: string) => void;
  vehicle: Vehicle | null; // null means Add New
  existingVehicles: Vehicle[];
}

const COLOR_PRESETS = [
  { hex: '#0284c7', label: 'Sky Blue' },
  { hex: '#10b981', label: 'Emerald' },
  { hex: '#f59e0b', label: 'Amber' },
  { hex: '#8b5cf6', label: 'Violet' },
  { hex: '#f43f5e', label: 'Rose' },
  { hex: '#06b6d4', label: 'Cyan' },
  { hex: '#6366f1', label: 'Indigo' },
  { hex: '#d97706', label: 'Bronze' },
];

const MODEL_PRESETS: { model: VehicleModelType; defaultVariant: string; icon: 'car' | 'truck' }[] = [
  { model: 'Mahindra Bolero', defaultVariant: 'Bolero Power+ ZLX (7-Seater)', icon: 'car' },
  { model: 'Mahindra Camper', defaultVariant: 'Camper Gold Double Cab', icon: 'truck' },
  { model: 'Mahindra Scorpio', defaultVariant: 'Scorpio Classic S11 (9-Seater)', icon: 'car' },
  { model: 'Tata Xenon / Yodha', defaultVariant: 'Yodha 1700 Commercial Crew', icon: 'truck' },
  { model: 'Force Trax', defaultVariant: 'Cruiser 10-Seater Spec', icon: 'car' },
  { model: 'Other Hired Vehicle', defaultVariant: 'Commercial Hired Fleet Cab', icon: 'car' },
];

const TAG_PRESETS = [
  'Staff Transport',
  'Office Inspection',
  'Material & Field Crew',
  'Mining Operations',
  'Administration & Transit',
  'Survey & Geology',
  'Emergency Standby',
];

export const VehicleModal: React.FC<VehicleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  vehicle,
  existingVehicles,
}) => {
  const isEditing = Boolean(vehicle);

  // Form states
  const [nickName, setNickName] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [model, setModel] = useState<VehicleModelType>('Mahindra Bolero');
  const [modelVariant, setModelVariant] = useState('Bolero Power+ ZLX (7-Seater)');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('+91 ');
  const [initialOdometer, setInitialOdometer] = useState<number>(50000);
  const [currentOdometer, setCurrentOdometer] = useState<number>(50000);
  const [contractRatePerKm, setContractRatePerKm] = useState<number>(15);
  const [monthlyFixedRate, setMonthlyFixedRate] = useState<number>(38000);
  const [fuelType, setFuelType] = useState<'Diesel' | 'Petrol' | 'EV' | 'CNG'>('Diesel');
  const [status, setStatus] = useState<'Active' | 'On Trip' | 'Maintenance' | 'Standby'>('Active');
  const [color, setColor] = useState('#0284c7');
  const [tag, setTag] = useState('Staff Transport');

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset or populate fields when modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (vehicle) {
      setNickName(vehicle.nickName || '');
      setRegNumber(vehicle.regNumber || '');
      setModel(vehicle.model || 'Mahindra Bolero');
      setModelVariant(vehicle.modelVariant || '');
      setDriverName(vehicle.driverName || '');
      setDriverPhone(vehicle.driverPhone || '');
      setInitialOdometer(vehicle.initialOdometer || 0);
      setCurrentOdometer(vehicle.currentOdometer || 0);
      setContractRatePerKm(vehicle.contractRatePerKm || 15);
      setMonthlyFixedRate(vehicle.monthlyFixedRate || 38000);
      setFuelType(vehicle.fuelType || 'Diesel');
      setStatus(vehicle.status || 'Active');
      setColor(vehicle.color || '#0284c7');
      setTag(vehicle.tag || 'Staff Transport');
      setErrors({});
    } else {
      // Defaults for a new vehicle
      const count = existingVehicles.length + 1;
      setNickName(`Bolero Unit ${count} (Transit)`);
      setRegNumber('KA-35-');
      setModel('Mahindra Bolero');
      setModelVariant('Bolero Power+ ZLX (7-Seater)');
      setDriverName('');
      setDriverPhone('+91 ');
      setInitialOdometer(45000);
      setCurrentOdometer(45000);
      setContractRatePerKm(15);
      setMonthlyFixedRate(38000);
      setFuelType('Diesel');
      setStatus('Active');
      setColor(COLOR_PRESETS[count % COLOR_PRESETS.length].hex);
      setTag('Staff Transport');
      setErrors({});
    }
  }, [isOpen, vehicle, existingVehicles.length]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!nickName.trim()) {
      newErrors.nickName = 'Vehicle nickname is required.';
    }

    const cleanReg = regNumber.trim().toUpperCase();
    if (!cleanReg) {
      newErrors.regNumber = 'Registration number is required.';
    } else {
      // Check duplicate
      const duplicate = existingVehicles.find(
        (v) => v.regNumber.toUpperCase() === cleanReg && (!vehicle || v.id !== vehicle.id)
      );
      if (duplicate) {
        newErrors.regNumber = `Registration number is already in use by ${duplicate.nickName}.`;
      }
    }

    if (!driverName.trim()) {
      newErrors.driverName = 'Assigned driver name is required.';
    }

    if (currentOdometer < 0 || isNaN(currentOdometer)) {
      newErrors.currentOdometer = 'Please enter a valid non-negative odometer reading.';
    }

    if (initialOdometer > currentOdometer) {
      newErrors.initialOdometer = 'Initial odometer cannot be greater than current odometer.';
    }

    if (contractRatePerKm <= 0 || isNaN(contractRatePerKm)) {
      newErrors.contractRatePerKm = 'Please enter a valid rate per KM.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: Omit<Vehicle, 'id'> = {
      nickName: nickName.trim(),
      regNumber: regNumber.trim().toUpperCase(),
      model,
      modelVariant: modelVariant.trim(),
      driverName: driverName.trim(),
      driverPhone: driverPhone.trim(),
      initialOdometer: Number(initialOdometer),
      currentOdometer: Number(currentOdometer),
      contractRatePerKm: Number(contractRatePerKm),
      monthlyFixedRate: Number(monthlyFixedRate || 0),
      fuelType,
      status,
      color,
      tag: tag.trim() || 'Staff Transport',
    };

    onSave(payload, vehicle?.id);
    onClose();
  };

  const handleModelChange = (newModel: VehicleModelType) => {
    setModel(newModel);
    const preset = MODEL_PRESETS.find((p) => p.model === newModel);
    if (preset && (!modelVariant || MODEL_PRESETS.some((p) => p.defaultVariant === modelVariant))) {
      setModelVariant(preset.defaultVariant);
    }
  };

  const isCamperOrTruck = model.toLowerCase().includes('camper') || model.toLowerCase().includes('yodha');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs font-bold"
              style={{ backgroundColor: color }}
            >
              {isCamperOrTruck ? <Truck className="w-5 h-5" /> : <Car className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {isEditing ? `Edit Vehicle: ${vehicle?.nickName}` : 'Add New Hired Vehicle'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? 'Update vehicle parameters, driver assignment, and contract terms'
                  : 'Register a new hired Bolero, Camper, or utility cab to the fleet'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Live Preview Card */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm"
                style={{ backgroundColor: color }}
              >
                {isCamperOrTruck ? <Truck className="w-5 h-5" /> : <Car className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    {nickName || 'Vehicle Nickname'}
                  </span>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-semibold border"
                    style={{ borderColor: `${color}60`, color, backgroundColor: `${color}15` }}
                  >
                    {tag || 'Tag'}
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                  <span className="font-mono font-bold text-amber-700">
                    {regNumber.trim().toUpperCase() || 'KA-35-XXXX'}
                  </span>
                  <span>•</span>
                  <span>{model}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Contract Rate</span>
              <span className="font-mono font-bold text-slate-900 text-sm">₹{contractRatePerKm} / KM</span>
            </div>
          </div>

          {/* Section 1: Identification & Model */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-600" /> Vehicle Identification & Model
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Vehicle Nickname / Display Title *
                </label>
                <input
                  type="text"
                  value={nickName}
                  onChange={(e) => setNickName(e.target.value)}
                  placeholder="e.g. Bolero Unit 3 (Mine Shift)"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
                {errors.nickName && (
                  <p className="text-rose-600 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.nickName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Registration Number *
                </label>
                <input
                  type="text"
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. KA-35-M-4821"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-900 uppercase focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
                {errors.regNumber && (
                  <p className="text-rose-600 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.regNumber}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle Model *</label>
                <select
                  value={model}
                  onChange={(e) => handleModelChange(e.target.value as VehicleModelType)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                >
                  {MODEL_PRESETS.map((p) => (
                    <option key={p.model} value={p.model}>
                      {p.model}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Model Variant & Specification
                </label>
                <input
                  type="text"
                  value={modelVariant}
                  onChange={(e) => setModelVariant(e.target.value)}
                  placeholder="e.g. Power+ ZLX 7-Seater / Camper Gold"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Duty Tag / Department Assignment
                </label>
                <input
                  type="text"
                  list="tag-options"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="e.g. Staff Transport"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
                <datalist id="tag-options">
                  {TAG_PRESETS.map((t) => (
                    <option key={t} value={t} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Badge Accent Color
                </label>
                <div className="flex items-center gap-2 pt-1">
                  {COLOR_PRESETS.map((p) => (
                    <button
                      key={p.hex}
                      type="button"
                      onClick={() => setColor(p.hex)}
                      className={`w-7 h-7 rounded-lg transition-transform flex items-center justify-center ${
                        color === p.hex ? 'scale-110 ring-2 ring-slate-900 ring-offset-2' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: p.hex }}
                      title={p.label}
                    >
                      {color === p.hex && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Driver & Status */}
          <div className="space-y-4 pt-2 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-600" /> Assigned Driver & Operation
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assigned Driver Name *
                </label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="e.g. Basavaraj K."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
                {errors.driverName && (
                  <p className="text-rose-600 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.driverName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Driver Phone Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    placeholder="+91 94481 23411"
                    className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Operational Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                >
                  <option value="Active">Active (Ready for Transit)</option>
                  <option value="On Trip">On Trip (Currently Running)</option>
                  <option value="Maintenance">Maintenance (Workshop)</option>
                  <option value="Standby">Standby (Depot Reserve)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Odometers & Rates */}
          <div className="space-y-4 pt-2 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-sky-600" /> Odometer Readings & Contract Rates
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Initial / Base Odometer (KM)
                </label>
                <input
                  type="number"
                  value={initialOdometer}
                  onChange={(e) => setInitialOdometer(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
                {errors.initialOdometer && (
                  <p className="text-rose-600 text-xs mt-1">{errors.initialOdometer}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Odometer (KM) *
                </label>
                <input
                  type="number"
                  value={currentOdometer}
                  onChange={(e) => setCurrentOdometer(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
                {errors.currentOdometer && (
                  <p className="text-rose-600 text-xs mt-1">{errors.currentOdometer}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rate / KM (₹) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={contractRatePerKm}
                  onChange={(e) => setContractRatePerKm(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
                {errors.contractRatePerKm && (
                  <p className="text-rose-600 text-xs mt-1">{errors.contractRatePerKm}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Monthly Fixed Rate (₹)
                </label>
                <input
                  type="number"
                  value={monthlyFixedRate}
                  onChange={(e) => setMonthlyFixedRate(Number(e.target.value))}
                  placeholder="38000"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Fuel Type
                </label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                >
                  <option value="Diesel">Diesel (Standard for Bolero & Camper)</option>
                  <option value="Petrol">Petrol</option>
                  <option value="CNG">CNG</option>
                  <option value="EV">Electric Vehicle (EV)</option>
                </select>
              </div>

              <div className="flex items-center">
                <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  Total Logged Net Odometer Delta:{' '}
                  <span className="font-mono font-bold text-slate-900">
                    {(currentOdometer - initialOdometer).toLocaleString()} KM
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-xs transition-all transform active:scale-95 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              {isEditing ? 'Save Vehicle Changes' : 'Add Vehicle to Fleet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
