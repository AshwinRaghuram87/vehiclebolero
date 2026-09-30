import React, { useState } from 'react';
import { Vehicle, TripLog } from '../types/fleet';
import { VehicleModal } from './VehicleModal';
import {
  Car,
  Truck,
  Edit3,
  CheckCircle2,
  User,
  Phone,
  Gauge,
  Shield,
  Fuel,
  Plus,
  Trash2,
  Settings2,
  Calendar,
  Layers,
  Activity,
  AlertTriangle,
} from 'lucide-react';

interface VehicleManagerViewProps {
  vehicles: Vehicle[];
  trips: TripLog[];
  onUpdateVehicle: (updated: Vehicle) => void;
  onAddVehicle: (newVehicle: Omit<Vehicle, 'id'>) => void;
  onDeleteVehicle: (vehicleId: string) => void;
  onOpenTripModalWithVehicle: (vehicleId: string) => void;
  onOpenAddFuelModal: (vehicleId?: string) => void;
}

export const VehicleManagerView: React.FC<VehicleManagerViewProps> = ({
  vehicles,
  trips,
  onUpdateVehicle,
  onAddVehicle,
  onDeleteVehicle,
  onOpenTripModalWithVehicle,
  onOpenAddFuelModal,
}) => {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState<Vehicle | null>(null);

  // Quick inline edit state
  const [quickEditingId, setQuickEditingId] = useState<string | null>(null);
  const [quickFormData, setQuickFormData] = useState<Partial<Vehicle>>({});

  // Fleet aggregate metrics
  const totalFleetKmLogged = trips.reduce((sum, t) => sum + (t.totalKm || 0), 0);
  const activeCount = vehicles.filter((v) => v.status === 'Active' || v.status === 'On Trip').length;

  const handleOpenAddModal = () => {
    setVehicleToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (v: Vehicle) => {
    setVehicleToEdit(v);
    setIsModalOpen(true);
  };

  const handleSaveModal = (data: Omit<Vehicle, 'id'>, existingId?: string) => {
    if (existingId) {
      onUpdateVehicle({
        ...data,
        id: existingId,
      });
    } else {
      onAddVehicle(data);
    }
  };

  const handleStartQuickEdit = (v: Vehicle) => {
    setQuickEditingId(v.id);
    setQuickFormData({ ...v });
  };

  const handleSaveQuickEdit = (v: Vehicle) => {
    onUpdateVehicle({
      ...v,
      ...quickFormData,
      currentOdometer: Number(quickFormData.currentOdometer || v.currentOdometer),
      contractRatePerKm: Number(quickFormData.contractRatePerKm || v.contractRatePerKm),
      monthlyFixedRate: Number(quickFormData.monthlyFixedRate || v.monthlyFixedRate),
    } as Vehicle);
    setQuickEditingId(null);
  };

  const handleDeleteWithPrompt = (v: Vehicle) => {
    if (vehicles.length <= 1) {
      alert('At least one vehicle must remain in the fleet configuration.');
      return;
    }

    const vehicleTrips = trips.filter((t) => t.vehicleId === v.id);
    let confirmMsg = `Are you sure you want to remove "${v.nickName}" (${v.regNumber}) from the active fleet?`;
    if (vehicleTrips.length > 0) {
      confirmMsg += `\n\nWarning: This vehicle currently has ${vehicleTrips.length} logged trip(s). Removing it will preserve old logs, but no new trips can be recorded for it.`;
    }

    if (window.confirm(confirmMsg)) {
      onDeleteVehicle(v.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              Fleet Management
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {vehicles.length} Units Configured
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5">
            Hired Vehicles Fleet Profile ({vehicles.length} Units)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Configure vehicle models, registration plates, drivers, odometer readings, and commercial contract rates
            for Sandur to Donimalai Mines transport logistics.
          </p>
        </div>

        {/* Primary CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-xs transition-all transform active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add New Vehicle</span>
          </button>
        </div>
      </div>

      {/* Fleet KPI Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-slate-500 block flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-600" /> Total Vehicles
          </span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono mt-1 block">
            {vehicles.length}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Hired units on contract</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-slate-500 block flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-600" /> Active in Duty
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-700 font-mono mt-1 block">
            {activeCount}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Ready or on transit</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-slate-500 block flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-sky-600" /> Total Logged KM
          </span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono mt-1 block">
            {totalFleetKmLogged.toLocaleString()} KM
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Across all recorded trips</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-slate-500 block flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-purple-600" /> Total Trips Logged
          </span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono mt-1 block">
            {trips.length}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Sandur ⇄ Donimalai logs</span>
        </div>
      </div>

      {/* Vehicle Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((v) => {
          const isQuickEditing = quickEditingId === v.id;
          const isTruckOrCamper =
            v.model.toLowerCase().includes('camper') || v.model.toLowerCase().includes('yodha');
          const vTrips = trips.filter((t) => t.vehicleId === v.id);
          const allTimeKm = vTrips.reduce((acc, t) => acc + (t.totalKm || 0), 0);
          const vehicleColor = v.color || '#0284c7';

          return (
            <div
              key={v.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all group"
            >
              <div className="space-y-4">
                {/* Vehicle Header with Color Accent */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-xs relative"
                      style={{ backgroundColor: vehicleColor }}
                    >
                      {isTruckOrCamper ? <Truck className="w-6 h-6" /> : <Car className="w-6 h-6" />}
                      {/* Status indicator badge */}
                      <span
                        className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                          v.status === 'Active'
                            ? 'bg-emerald-500'
                            : v.status === 'On Trip'
                            ? 'bg-sky-500'
                            : v.status === 'Maintenance'
                            ? 'bg-rose-500'
                            : 'bg-slate-400'
                        }`}
                        title={`Status: ${v.status}`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-slate-900 leading-snug">{v.nickName}</h3>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-mono font-bold text-amber-700">{v.regNumber}</span>
                        <span className="text-[10px] text-slate-400">•</span>
                        <span className="text-[11px] text-slate-500">{v.model}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Header */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(v)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                      title="Edit full vehicle details"
                    >
                      <Settings2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() =>
                        isQuickEditing ? handleSaveQuickEdit(v) : handleStartQuickEdit(v)
                      }
                      className={`p-1.5 rounded-lg transition-colors ${
                        isQuickEditing
                          ? 'bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1 px-2'
                          : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                      }`}
                      title={isQuickEditing ? 'Save quick edits' : 'Quick edit inline'}
                    >
                      {isQuickEditing ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Save
                        </>
                      ) : (
                        <Edit3 className="w-4 h-4" />
                      )}
                    </button>

                    {vehicles.length > 1 && (
                      <button
                        onClick={() => handleDeleteWithPrompt(v)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Remove vehicle from fleet"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Tag & Specification Badge */}
                <div className="flex items-center flex-wrap gap-1.5">
                  <span
                    className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold border"
                    style={{
                      borderColor: `${vehicleColor}50`,
                      color: vehicleColor,
                      backgroundColor: `${vehicleColor}12`,
                    }}
                  >
                    {v.tag || 'Staff Transit'}
                  </span>
                  {v.modelVariant && (
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                      {v.modelVariant}
                    </span>
                  )}
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono">
                    {v.fuelType || 'Diesel'}
                  </span>
                </div>

                {/* Form or Details */}
                {isQuickEditing ? (
                  <div className="space-y-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200 text-slate-500 font-bold text-[11px]">
                      <span>Quick Inline Editor</span>
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(v)}
                        className="text-amber-600 hover:underline text-[10px]"
                      >
                        Open Full Form →
                      </button>
                    </div>

                    <div>
                      <label className="block text-slate-600 mb-1 font-medium">Registration Number</label>
                      <input
                        type="text"
                        value={quickFormData.regNumber || ''}
                        onChange={(e) =>
                          setQuickFormData({ ...quickFormData, regNumber: e.target.value.toUpperCase() })
                        }
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono font-bold focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1 font-medium">Assigned Driver Name</label>
                      <input
                        type="text"
                        value={quickFormData.driverName || ''}
                        onChange={(e) =>
                          setQuickFormData({ ...quickFormData, driverName: e.target.value })
                        }
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1 font-medium">Driver Contact Phone</label>
                      <input
                        type="text"
                        value={quickFormData.driverPhone || ''}
                        onChange={(e) =>
                          setQuickFormData({ ...quickFormData, driverPhone: e.target.value })
                        }
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-600 mb-1 font-medium">Odometer (KM)</label>
                        <input
                          type="number"
                          value={quickFormData.currentOdometer || 0}
                          onChange={(e) =>
                            setQuickFormData({
                              ...quickFormData,
                              currentOdometer: Number(e.target.value),
                            })
                          }
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1 font-medium">Rate / KM (₹)</label>
                        <input
                          type="number"
                          value={quickFormData.contractRatePerKm || 15}
                          onChange={(e) =>
                            setQuickFormData({
                              ...quickFormData,
                              contractRatePerKm: Number(e.target.value),
                            })
                          }
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1 font-medium">Operational Status</label>
                      <select
                        value={quickFormData.status || 'Active'}
                        onChange={(e) =>
                          setQuickFormData({ ...quickFormData, status: e.target.value as any })
                        }
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
                    {/* Driver & Assignment Details Box */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2.5">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1.5 font-medium">
                          <User className="w-3.5 h-3.5 text-amber-600" /> Primary Driver
                        </span>
                        <strong className="text-slate-900 font-semibold">{v.driverName}</strong>
                      </div>

                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Phone className="w-3.5 h-3.5 text-emerald-600" /> Phone
                        </span>
                        <a
                          href={`tel:${v.driverPhone}`}
                          className="font-mono text-slate-700 hover:text-emerald-700 hover:underline"
                        >
                          {v.driverPhone || 'Not assigned'}
                        </a>
                      </div>

                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Shield className="w-3.5 h-3.5 text-sky-600" /> Contract Model
                        </span>
                        <span className="text-slate-700 font-medium">
                          {v.monthlyFixedRate ? `₹${v.monthlyFixedRate.toLocaleString()}/mo` : 'Hired Fleet'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Gauge className="w-3.5 h-3.5 text-orange-600" /> Per KM Rate
                        </span>
                        <strong className="font-mono text-amber-700 font-bold">
                          ₹{v.contractRatePerKm} / KM
                        </strong>
                      </div>
                    </div>

                    {/* Stats Comparison */}
                    <div className="grid grid-cols-2 gap-2 text-center text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 text-[10px] block">Current Odometer</span>
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          {v.currentOdometer.toLocaleString()} KM
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 text-[10px] block">Logged Trips ({vTrips.length})</span>
                        <span className="font-mono font-bold text-amber-700 text-sm">
                          {allTimeKm.toLocaleString()} KM
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-2 mt-4">
                <button
                  onClick={() => onOpenTripModalWithVehicle(v.id)}
                  className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-xs text-center"
                >
                  Log Trip
                </button>

                <button
                  onClick={() => onOpenAddFuelModal(v.id)}
                  className="py-2 px-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs transition-all border border-orange-200 flex items-center gap-1"
                  title="Record fuel refill"
                >
                  <Fuel className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Refuel</span>
                </button>

                <button
                  onClick={() => handleOpenEditModal(v)}
                  className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all"
                  title="Edit full parameters"
                >
                  Edit
                </button>
              </div>
            </div>
          );
        })}

        {/* Add New Vehicle Card CTA */}
        <div
          onClick={handleOpenAddModal}
          className="border-2 border-dashed border-slate-300 hover:border-amber-400 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-amber-50/30 transition-all min-h-[340px] group"
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-100 transition-all shadow-xs">
            <Plus className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h3 className="mt-4 font-bold text-slate-900 text-base group-hover:text-amber-700">
            Add Another Vehicle
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-xs">
            Register another Mahindra Bolero, Camper, pickup, or commercial transit cab to your Sandur-Donimalai fleet.
          </p>
          <button className="mt-4 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs transition-all">
            + Configure New Vehicle
          </button>
        </div>
      </div>

      {/* Global Vehicle Add / Edit Modal */}
      <VehicleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setVehicleToEdit(null);
        }}
        onSave={handleSaveModal}
        vehicle={vehicleToEdit}
        existingVehicles={vehicles}
      />
    </div>
  );
};
