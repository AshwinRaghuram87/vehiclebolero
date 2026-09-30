import React, { useState, useEffect } from 'react';
import { Vehicle, TripLog, FuelLog } from './types/fleet';
import {
  getStoredVehicles,
  saveStoredVehicles,
  getStoredTripLogs,
  saveStoredTripLogs,
  getStoredFuelLogs,
  saveStoredFuelLogs,
  resetAllData,
  updateVehicleOdometer,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { DailyEntryView } from './components/DailyEntryView';
import { KmReportsView } from './components/KmReportsView';
import { MonthlyFuelReportView } from './components/MonthlyFuelReportView';
import { VehicleManagerView } from './components/VehicleManagerView';
import { TripEntryModal } from './components/TripEntryModal';
import { AddFuelModal } from './components/AddFuelModal';
import { getTodayString } from './utils/dateUtils';
import { MapPin, ShieldCheck, Truck, Car } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'entry' | 'reports' | 'fuel' | 'vehicles'>('dashboard');
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => getStoredVehicles());
  const [trips, setTrips] = useState<TripLog[]>(() => getStoredTripLogs());
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(() => getStoredFuelLogs());

  // Trip Modal state
  const [isTripModalOpen, setIsTripModalOpen] = useState<boolean>(false);
  const [editingTrip, setEditingTrip] = useState<TripLog | null>(null);
  const [modalVehicleId, setModalVehicleId] = useState<string | undefined>(undefined);
  const [modalDate, setModalDate] = useState<string | undefined>(undefined);

  // Fuel Modal state
  const [isFuelModalOpen, setIsFuelModalOpen] = useState<boolean>(false);
  const [fuelModalVehicleId, setFuelModalVehicleId] = useState<string | undefined>(undefined);

  // Sync to local storage
  useEffect(() => {
    saveStoredVehicles(vehicles);
  }, [vehicles]);

  useEffect(() => {
    saveStoredTripLogs(trips);
  }, [trips]);

  useEffect(() => {
    saveStoredFuelLogs(fuelLogs);
  }, [fuelLogs]);

  // Handle saving a fuel log
  const handleSaveFuelLog = (logData: Omit<FuelLog, 'id' | 'createdAt'>) => {
    const newFuelLog: FuelLog = {
      ...logData,
      id: `fuel-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
    };
    setFuelLogs([newFuelLog, ...fuelLogs]);

    // Also update vehicle's current odometer if refuel odometer is higher
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === logData.vehicleId && logData.odometerAtRefuel > v.currentOdometer) {
          return { ...v, currentOdometer: logData.odometerAtRefuel };
        }
        return v;
      })
    );
  };

  // Handle deleting a fuel log
  const handleDeleteFuelLog = (fuelId: string) => {
    if (window.confirm('Are you sure you want to delete this fuel refill record?')) {
      const updated = fuelLogs.filter((f) => f.id !== fuelId);
      setFuelLogs(updated);
    }
  };

  // Open fuel modal for a vehicle
  const handleOpenAddFuelModal = (vehicleId?: string) => {
    setFuelModalVehicleId(vehicleId);
    setIsFuelModalOpen(true);
  };

  // Handle saving a trip (either create or update)
  const handleSaveTrip = (tripData: Omit<TripLog, 'id' | 'createdAt'>) => {
    if (editingTrip) {
      // Update existing trip
      const updatedTrip: TripLog = {
        ...editingTrip,
        ...tripData,
      };
      const updatedTrips = trips.map((t) => (t.id === editingTrip.id ? updatedTrip : t));
      setTrips(updatedTrips);

      // Check if endKm is higher than vehicle's current odometer
      setVehicles((prev) =>
        prev.map((v) => {
          if (v.id === tripData.vehicleId && tripData.endKm > v.currentOdometer) {
            return { ...v, currentOdometer: tripData.endKm };
          }
          return v;
        })
      );

      setEditingTrip(null);
    } else {
      // Create new trip
      const newTrip: TripLog = {
        ...tripData,
        id: `trip-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date().toISOString(),
      };
      const updatedTrips = [newTrip, ...trips];
      setTrips(updatedTrips);

      // Update vehicle's current odometer
      setVehicles((prev) =>
        prev.map((v) => {
          if (v.id === tripData.vehicleId && tripData.endKm > v.currentOdometer) {
            return { ...v, currentOdometer: tripData.endKm };
          }
          return v;
        })
      );
    }
  };

  // Open modal for editing
  const handleOpenEditTrip = (trip: TripLog) => {
    setEditingTrip(trip);
    setModalVehicleId(trip.vehicleId);
    setModalDate(trip.date);
    setIsTripModalOpen(true);
  };

  // Duplicate a trip for today
  const handleDuplicateTrip = (trip: TripLog) => {
    const today = getTodayString();
    const targetVehicle = vehicles.find((v) => v.id === trip.vehicleId);
    const startKm = targetVehicle ? targetVehicle.currentOdometer : trip.endKm;
    const endKm = startKm + trip.totalKm;

    setEditingTrip(null);
    setModalVehicleId(trip.vehicleId);
    setModalDate(today);

    // Open modal with prefilled data
    const duplicateData: TripLog = {
      ...trip,
      id: '',
      date: today,
      startKm,
      endKm,
      voucherNumber: `LOG-${today.replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
    };
    setEditingTrip(duplicateData);
    setIsTripModalOpen(true);
  };

  // Delete trip
  const handleDeleteTrip = (tripId: string) => {
    if (window.confirm('Are you sure you want to delete this trip log?')) {
      const updatedTrips = trips.filter((t) => t.id !== tripId);
      setTrips(updatedTrips);
    }
  };

  // Update vehicle
  const handleUpdateVehicle = (updatedVehicle: Vehicle) => {
    const updated = vehicles.map((v) => (v.id === updatedVehicle.id ? updatedVehicle : v));
    setVehicles(updated);
  };

  // Open trip modal for a specific vehicle
  const handleOpenTripModalWithVehicle = (vehicleId: string) => {
    setEditingTrip(null);
    setModalVehicleId(vehicleId);
    setModalDate(getTodayString());
    setIsTripModalOpen(true);
  };

  // Reset to default sample demo data
  const handleResetData = () => {
    if (window.confirm('Reset all trip logs, fuel logs, and vehicles to standard Sandur-Donimalai sample data?')) {
      const reset = resetAllData();
      setVehicles(reset.vehicles);
      setTrips(reset.trips);
      setFuelLogs(reset.fuelLogs);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenNewTripModal={() => {
          setEditingTrip(null);
          setModalVehicleId(undefined);
          setModalDate(getTodayString());
          setIsTripModalOpen(true);
        }}
        onOpenAddFuelModal={() => handleOpenAddFuelModal()}
        onResetData={handleResetData}
        vehicles={vehicles}
      />

      {/* Main App Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'dashboard' && (
          <DashboardView
            vehicles={vehicles}
            trips={trips}
            fuelLogs={fuelLogs}
            onOpenTripModalWithVehicle={handleOpenTripModalWithVehicle}
            onOpenAddFuelModal={handleOpenAddFuelModal}
            onNavigateToReports={() => setCurrentTab('reports')}
            onNavigateToFuel={() => setCurrentTab('fuel')}
            onNavigateToEntry={() => setCurrentTab('entry')}
          />
        )}

        {currentTab === 'entry' && (
          <DailyEntryView
            vehicles={vehicles}
            trips={trips}
            onOpenAddFuelModal={handleOpenAddFuelModal}
            onSaveTrip={handleSaveTrip}
            onEditTrip={handleOpenEditTrip}
            onDeleteTrip={handleDeleteTrip}
            onDuplicateTrip={handleDuplicateTrip}
          />
        )}

        {currentTab === 'reports' && (
          <KmReportsView
            trips={trips}
            vehicles={vehicles}
            fuelLogs={fuelLogs}
            onOpenAddFuelModal={handleOpenAddFuelModal}
            onDeleteFuelLog={handleDeleteFuelLog}
            onEditTrip={handleOpenEditTrip}
            onDeleteTrip={handleDeleteTrip}
            onDuplicateTrip={handleDuplicateTrip}
          />
        )}

        {currentTab === 'fuel' && (
          <MonthlyFuelReportView
            vehicles={vehicles}
            trips={trips}
            fuelLogs={fuelLogs}
            onOpenAddFuelModal={handleOpenAddFuelModal}
            onDeleteFuelLog={handleDeleteFuelLog}
          />
        )}

        {currentTab === 'vehicles' && (
          <VehicleManagerView
            vehicles={vehicles}
            trips={trips}
            onUpdateVehicle={handleUpdateVehicle}
            onOpenTripModalWithVehicle={handleOpenTripModalWithVehicle}
          />
        )}
      </main>

      {/* Global Trip Entry & Edit Modal */}
      <TripEntryModal
        isOpen={isTripModalOpen}
        onClose={() => {
          setIsTripModalOpen(false);
          setEditingTrip(null);
        }}
        vehicles={vehicles}
        onSaveTrip={handleSaveTrip}
        initialData={editingTrip}
        defaultVehicleId={modalVehicleId}
        defaultDate={modalDate}
      />

      {/* Global Add Fuel Modal */}
      <AddFuelModal
        isOpen={isFuelModalOpen}
        onClose={() => {
          setIsFuelModalOpen(false);
          setFuelModalVehicleId(undefined);
        }}
        vehicles={vehicles}
        onSaveFuelLog={handleSaveFuelLog}
        defaultVehicleId={fuelModalVehicleId}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-6 text-xs text-slate-500 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-slate-700">
              Sandur Head Office ⇄ Donimalai Mines Transport Logistics
            </span>
          </div>

          <div className="flex items-center space-x-4 text-slate-500">
            <span>3 Hired Vehicles: 2 Mahindra Bolero & 1 Mahindra Camper</span>
            <span>•</span>
            <span className="font-mono">Local Data Persisted</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
