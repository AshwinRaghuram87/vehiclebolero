import React from 'react';
import { Truck, Calendar, BarChart3, PlusCircle, Car, RefreshCw, MapPin, Fuel } from 'lucide-react';
import { Vehicle } from '../types/fleet';

interface NavbarProps {
  currentTab: 'dashboard' | 'entry' | 'reports' | 'fuel' | 'vehicles';
  setCurrentTab: (tab: 'dashboard' | 'entry' | 'reports' | 'fuel' | 'vehicles') => void;
  onOpenNewTripModal: () => void;
  onOpenAddFuelModal: () => void;
  onResetData: () => void;
  vehicles: Vehicle[];
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenNewTripModal,
  onOpenAddFuelModal,
  onResetData,
  vehicles,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Route Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-xs shadow-amber-500/20 text-slate-950 font-black">
              <Truck className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900">
                  Sandur <span className="text-amber-600">⇄</span> Donimalai
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  Hired Fleet
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-600" />
                Office Commute & Mine Trip Monitor (3 Vehicles)
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Fleet Overview</span>
            </button>

            <button
              onClick={() => setCurrentTab('entry')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'entry'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Daily Log Entry</span>
            </button>

            <button
              onClick={() => setCurrentTab('reports')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'reports'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>KM Reports</span>
            </button>

            <button
              onClick={() => setCurrentTab('fuel')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'fuel'
                  ? 'bg-orange-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Fuel className="w-4 h-4 text-orange-600" />
              <span>Monthly Fuel & Cost</span>
            </button>

            <button
              onClick={() => setCurrentTab('vehicles')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'vehicles'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Vehicles ({vehicles.length})</span>
            </button>
          </nav>

          {/* Quick CTA Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onResetData}
              title="Reset to sample demo data"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors text-xs flex items-center gap-1 border border-slate-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Reset</span>
            </button>

            <button
              onClick={onOpenAddFuelModal}
              className="flex items-center space-x-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold px-3 py-2 rounded-lg border border-orange-200 text-xs sm:text-sm transition-all"
            >
              <Fuel className="w-4 h-4" />
              <span className="hidden sm:inline">Add Fuel</span>
            </button>

            <button
              onClick={onOpenNewTripModal}
              className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-2 rounded-lg shadow-xs text-xs sm:text-sm transition-all transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Log Trip</span>
              <span className="sm:hidden">Log</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 border-t border-slate-200 gap-1 scrollbar-none">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              currentTab === 'dashboard' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setCurrentTab('entry')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              currentTab === 'entry' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            Daily Entry
          </button>
          <button
            onClick={() => setCurrentTab('reports')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              currentTab === 'reports' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            KM Reports
          </button>
          <button
            onClick={() => setCurrentTab('fuel')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              currentTab === 'fuel' ? 'bg-orange-500 text-slate-950 font-bold' : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            Monthly Fuel
          </button>
          <button
            onClick={() => setCurrentTab('vehicles')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              currentTab === 'vehicles' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            Vehicles (3)
          </button>
        </div>
      </div>
    </header>
  );
};
