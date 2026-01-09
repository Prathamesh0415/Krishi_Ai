"use client";
import { CloudSun, TrendingUp, Droplets, AlertTriangle } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Overview</h2>
          <p className="text-gray-500">Welcome back, Farmer! Here is what's happening today.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Today's Date</p>
          <p className="text-lg font-semibold text-emerald-700">Oct 24, 2025</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Weather" 
          value="24°C" 
          sub="Sunny & Clear" 
          icon={CloudSun} 
          color="bg-blue-50 text-blue-600" 
        />
        <StatCard 
          title="Soil Moisture" 
          value="62%" 
          sub="Optimal Level" 
          icon={Droplets} 
          color="bg-cyan-50 text-cyan-600" 
        />
        <StatCard 
          title="Market Price" 
          value="₹2,400/Q" 
          sub="Wheat (+5%)" 
          icon={TrendingUp} 
          color="bg-emerald-50 text-emerald-600" 
        />
        <StatCard 
          title="Alerts" 
          value="2" 
          sub="Pest Warning" 
          icon={AlertTriangle} 
          color="bg-amber-50 text-amber-600" 
        />
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activity / Crop Health */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Crop Health Status</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                    {i}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Field {i} - Wheat</h4>
                    <p className="text-sm text-gray-500">Last inspected 2 days ago</p>
                  </div>
                </div>
                <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                  Healthy
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / Tips */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Krishi Mitr Tips</h3>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
              <p className="text-sm text-yellow-800 font-medium">
                High humidity expected tomorrow. Avoid irrigation in the evening.
              </p>
            </div>
            <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
              <p className="text-sm text-blue-800 font-medium">
                Govt subsidy for solar pumps is closing next week.
              </p>
            </div>
          </div>
          <button className="w-full mt-6 py-2 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">
            Ask Krishi Mitr AI
          </button>
        </div>

      </div>
    </div>
  );
}

// Simple Helper Component for Stats
function StatCard({ title, value, sub, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
          <p className="text-xs text-gray-400 mt-1">{sub}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}