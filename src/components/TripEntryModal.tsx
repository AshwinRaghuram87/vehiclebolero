import React from 'react';
import { X, Truck } from 'lucide-react';
import { Vehicle, TripLog } from '../types/fleet';
import { TripEntryForm } from './TripEntryForm';

interface TripEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  onSaveTrip: (tripData: Omit<TripLog, 'id' | 'createdAt'>) => void;
  initialData?: TripLog | null;
  defaultVehicleId?: string;
  defaultDate?: string;
}

export const TripEntryModal: React.FC<TripEntryModalProps> = ({
  isOpen,
  onClose,
  vehicles,
  onSaveTrip,
  initialData,
  defaultVehicleId,
  defaultDate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden my-6 max-h-[92vh] flex flex-col text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-white sticky top-0 z-10">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {initialData ? 'Edit Trip Record' : 'Manual Daily Trip Entry'}
              </h2>
              <p className="text-xs text-slate-500">
                Sandur ⇄ Donimalai Hired Transport Log (Bolero & Camper)
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
        <div className="p-5 overflow-y-auto">
          <TripEntryForm
            vehicles={vehicles}
            onSaveTrip={(data) => {
              onSaveTrip(data);
              onClose();
            }}
            onCancel={onClose}
            initialData={initialData}
            defaultVehicleId={defaultVehicleId}
            defaultDate={defaultDate}
          />
        </div>
      </div>
    </div>
  );
};
