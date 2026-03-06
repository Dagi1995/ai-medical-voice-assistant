import React from "react";
import HistoryList from "../_components/HistoryList";
import AddNewSessionDialog from "../_components/AddNewSessionDialog";
import DoctorsAgentList from "../_components/DoctorsAgentLIst";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Dashboard
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Welcome back! Manage your sessions and doctor agents.
              </p>
            </div>
            <AddNewSessionDialog />
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* History Section */}
          <section className="bg-card text-card-foreground rounded-xl shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                Session History
              </h2>
              <span className="text-sm text-muted-foreground font-medium">
                Last 30 days
              </span>
            </div>
            <HistoryList />
          </section>

          {/* Doctors Agents Section */}
          <section className="bg-card text-card-foreground rounded-xl shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                Doctor Agents
              </h2>
              <button className="text-sm text-primary-foreground hover:text-primary font-medium">
                View All →
              </button>
            </div>
            <DoctorsAgentList />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
