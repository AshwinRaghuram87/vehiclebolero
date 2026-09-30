import React, { useState } from 'react';
import { Vehicle, TripLog } from '../types/fleet';
import { formatKm, formatCurrency } from '../utils/dateUtils';
import { Car, Truck, Edit3, CheckCircle2, User, Phone, Gauge, Shield, Fuel } from 'lucide-react';

interface VehicleManagerViewProps {
  vehicles: Vehicle[];
  trips: TripLog[];
  onUpdateVehicle: (updated: Vehicle) => void;
  onOpenTripModalWithVehicle: (vehicleId: string) => void;
}

export const VehicleManagerView: React.FC<VehicleManagerViewProps> = ({
  vehicles,
  trips,
  onUpdateVehicle,
  onOpenTripModalWithVehicle,
}) => {
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Vehicle>>({});

  const handleStartEdit = (v: Vehicle) => {
    setEditingVehicleId(v.id);
    setEditFormData({ ...v });
  };

  const handleSaveEdit = (v: Vehicle) => {
    onUpdateVehicle({
      ...v,
      ...editFormData,
      currentOdometer: Number(editFormData.currentOdometer || v.currentOdometer),
      contractRatePerKm: Number(editFormData.contractRatePerKm || v.contractRatePerKm),
    } as Vehicle);
    setEditingVehicleId(null);
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Hired Vehicles Fleet Profile (3 Units)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          2 Mahindra Boleros (Passenger cabs) and 1 Mahindra Camper (Utility & material vehicle) hired for
          Sandur to Donimalai office transit.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {vehicles.map((v) => {
          const isEditing = editingVehicleId === v.id;
          const isCamper = v.model === 'Mahindra Camper';
          const vTrips = trips.filter((t) => t.vehicleId === v.id);
          const allTimeKm = vTrips.reduce((acc, t) => acc + t.totalKm, 0);

          return (
            <div
              key={v.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Vehicle Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isCamper
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : v.regNumber.includes('4821')
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {isCamper ? <Truck className="w-6 h-6" /> : <Car className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900">{v.nickName}</h3>
                      <div className="text-xs font-mono font-bold text-amber-700">{v.regNumber}</div>
                    </div>
                  </div>

                  {!isEditing ? (
                    <button
                      onClick={() => handleStartEdit(v)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 transition-colors"
                      title="Edit vehicle details"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSaveEdit(v)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Save
                    </button>
                  )}
                </div>

                {/* Form or Details */}
                {isEditing ? (
                  <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <label className="block text-slate-600 mb-1 font-medium">Registration Number</label>
                      <input
                        type="text"
                        value={editFormData.regNumber || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, regNumber: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1 font-medium">Assigned Driver Name</label>
                      <input
                        type="text"
                        value={editFormData.driverName || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, driverName: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1 font-medium">Driver Contact Phone</label>
                      <input
                        type="text"
                        value={editFormData.driverPhone || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, driverPhone: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-600 mb-1 font-medium">Odometer (KM)</label>
                        <input
                          type="number"
                          value={editFormData.currentOdometer || 0}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, currentOdometer: Number(e.target.value) })
                          }
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1 font-medium">Rate / KM (₹)</label>
                        <input
                          type="number"
                          value={editFormData.contractRatePerKm || 15}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, contractRatePerKm: Number(e.target.value) })
                          }
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1 font-medium">Status</label>
                      <select
                        value={editFormData.status || 'Active'}
                        onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as any })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-amber-500"
                      >
                        <option value="Active">Active</option>
                        <option value="On Trip">On Trip</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Standby">Standby</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1.5 font-medium">
                          <User className="w-3.5 h-3.5 text-amber-600" /> Primary Driver
                        </span>
                        <strong className="text-slate-900">{v.driverName}</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Phone className="w-3.5 h-3.5 text-emerald-600" /> Phone
                        </span>
                        <span className="font-mono text-slate-700">{v.driverPhone}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Shield className="w-3.5 h-3.5 text-sky-600" /> Contract Model
                        </span>
                        <span className="text-slate-700 font-medium">Hired Office Vehicle</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Gauge className="w-3.5 h-3.5 text-orange-600" /> Per KM Rate
                        </span>
                        <strong className="font-mono text-amber-700">₹{v.contractRatePerKm} / KM</strong>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 text-center text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 text-[10px] block">Current Odometer</span>
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          {v.currentOdometer.toLocaleString()} KM
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 text-[10px] block">Logged Mileage</span>
                        <span className="font-mono font-bold text-amber-700 text-sm">
                          {allTimeKm.toLocaleString()} KM
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => onOpenTripModalWithVehicle(v.id)}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-xs"
              >
                Log Trip for {v.nickName.split(' ')[0]}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
