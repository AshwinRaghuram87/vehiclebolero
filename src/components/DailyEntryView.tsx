import React, { useState } from 'react';
import { Vehicle, TripLog } from '../types/fleet';
import { getTodayString, formatDateDisplay, formatDayName } from '../utils/dateUtils';
import { TripEntryForm } from './TripEntryForm';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Car,
  Truck,
  PlusCircle,
  FileCheck,
  Trash2,
  Edit2,
  Copy,
  Info,
  Fuel,
} from 'lucide-react';

interface DailyEntryViewProps {
  vehicles: Vehicle[];
  trips: TripLog[];
  onOpenAddFuelModal?: (vehicleId?: string) => void;
  onSaveTrip: (tripData: Omit<TripLog, 'id' | 'createdAt'>) => void;
  onEditTrip: (trip: TripLog) => void;
  onDeleteTrip: (tripId: string) => void;
  onDuplicateTrip: (trip: TripLog) => void;
}

export const DailyEntryView: React.FC<DailyEntryViewProps> = ({
  vehicles,
  trips,
  onOpenAddFuelModal,
  onSaveTrip,
  onEditTrip,
  onDeleteTrip,
  onDuplicateTrip,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());

  // Navigate dates
  const handlePrevDay = () => {
    const [y, m, d] = selectedDate.split('-');
    const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    date.setDate(date.getDate() - 1);
    const newY = date.getFullYear();
    const newM = String(date.getMonth() + 1).padStart(2, '0');
    const newD = String(date.getDate()).padStart(2, '0');
    setSelectedDate(`${newY}-${newM}-${newD}`);
  };

  const handleNextDay = () => {
    const [y, m, d] = selectedDate.split('-');
    const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    date.setDate(date.getDate() + 1);
    const newY = date.getFullYear();
    const newM = String(date.getMonth() + 1).padStart(2, '0');
    const newD = String(date.getDate()).padStart(2, '0');
    setSelectedDate(`${newY}-${newM}-${newD}`);
  };

  const dayTrips = trips.filter((t) => t.date === selectedDate);
  const totalDayKm = dayTrips.reduce((acc, t) => acc + t.totalKm, 0);

  return (
    <div className="space-y-6">
      {/* Date Header & Day Switcher */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Daily Trip Data Entry (Manual)
              </h1>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                Logbook Mode
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select date to review recorded logs and enter new vehicle odometer journeys for Sandur ⇄ Donimalai.
            </p>
          </div>

          {/* Date Navigator Bar */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-xl shadow-xs">
            <button
              onClick={handlePrevDay}
              title="Previous Day"
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 px-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-bold text-slate-900 font-mono focus:outline-none cursor-pointer"
              />
              <span className="text-xs text-slate-500">({formatDayName(selectedDate)})</span>
            </div>

            <button
              onClick={handleNextDay}
              title="Next Day"
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setSelectedDate(getTodayString())}
              className="ml-1 px-2.5 py-1 text-xs rounded-lg font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors shadow-xs"
            >
              Today
            </button>
          </div>
        </div>

        {/* Day Summary Ticker */}
        <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Selected Date:</span>
            <strong className="text-slate-900 font-mono">{formatDateDisplay(selectedDate)}</strong>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">Trips Recorded:</span>
            <strong className="text-amber-700 font-mono">{dayTrips.length}</strong>
          </div>

          <div className="flex items-center gap-3">
            {onOpenAddFuelModal && (
              <button
                onClick={() => onOpenAddFuelModal()}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-bold transition-all"
              >
                <Fuel className="w-3.5 h-3.5" />
                <span>+ Log Fuel Refill (₹100.04/L)</span>
              </button>
            )}

            <span className="text-slate-500">Total Distance Logged:</span>
            <span className="px-2.5 py-0.5 rounded-md font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 text-sm">
              {totalDayKm} KM
            </span>
          </div>
        </div>
      </div>

      {/* Trips Already Recorded on this Date */}
      {dayTrips.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              Recorded Trips on {formatDateDisplay(selectedDate)} ({dayTrips.length})
            </h3>
            <span className="text-xs text-slate-500">Click actions to edit or duplicate</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dayTrips.map((t) => {
              const isCamper = t.vehicleModel === 'Mahindra Camper';
              return (
                <div
                  key={t.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 hover:border-slate-300 transition-all shadow-2xs"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`p-1.5 rounded-lg ${
                          isCamper
                            ? 'bg-amber-100 text-amber-800'
                            : t.vehicleReg.includes('4821')
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isCamper ? <Truck className="w-4 h-4" /> : <Car className="w-4 h-4" />}
                      </span>
                      <div>
                        <div className="font-bold text-xs text-slate-900">{t.vehicleModel}</div>
                        <div className="font-mono text-[11px] text-amber-700 font-semibold">{t.vehicleReg}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {t.totalKm} KM
                      </span>
                      <button
                        onClick={() => onDuplicateTrip(t)}
                        title="Duplicate"
                        className="p-1 text-slate-400 hover:text-amber-600"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onEditTrip(t)}
                        title="Edit"
                        className="p-1 text-slate-400 hover:text-sky-600"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteTrip(t.id)}
                        title="Delete"
                        className="p-1 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-slate-800 font-medium">
                    {t.routeFrom} <span className="text-amber-600">⇄</span> {t.routeTo}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
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
                      Site: {t.destinationSite || 'DIOM'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Driver: <strong className="text-slate-800">{t.driverName}</strong>
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-slate-500">
                    <span>
                      Odo: <strong className="font-mono text-slate-800">{t.startKm} → {t.endKm}</strong>
                    </span>
                    <span className="font-mono font-bold text-amber-700">{t.totalKm} KM</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Manual Entry Form Box */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-amber-600" />
            Enter Trip Log for {formatDateDisplay(selectedDate)}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Fill in the vehicle odometer reading, route details, and driver shift. Start KM automatically updates.
          </p>
        </div>

        <TripEntryForm
          vehicles={vehicles}
          onSaveTrip={onSaveTrip}
          defaultDate={selectedDate}
        />
      </div>
    </div>
  );
};
