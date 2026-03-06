import React from "react";
import HistoryList from "../_components/HistoryList";
import AddNewSessionDialog from "../_components/AddNewSessionDialog";
import DoctorsAgentLIst from "../_components/DoctorsAgentLIst";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Dashboard
              </h1>
              <p className="text-gray-600 mt-1 text-base">
                Welcome back! Manage your sessions and doctor agents.
              </p>
            </div>
            <AddNewSessionDialog />
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* History Section */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Session History
              </h2>
              <span className="text-sm text-gray-500 font-medium">
                Last 30 days
              </span>
            </div>
            <HistoryList />
          </section>

          {/* Doctors Agents Section */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Doctor Agents
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View All →
              </button>
            </div>
            <DoctorsAgentLIst />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
