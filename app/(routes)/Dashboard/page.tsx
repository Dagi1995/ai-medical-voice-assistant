import React from "react";
import HistoryList from "./_components/HistoryList";
import { Button } from "@/components/ui/button";
import DoctorsAgentLIst from "./_components/DoctorsAgentLIst";
import AddNewSessionDialog from "./_components/AddNewSessionDialog";
const Dashboard = () => {
  return (
    <div>
      <div className="flex justify-between items-center ">
        <h2 className="font-bold text-2xl">My Dashboard</h2>

        <AddNewSessionDialog></AddNewSessionDialog>
      </div>
      <HistoryList />
      <DoctorsAgentLIst />
    </div>
  );
};

export default Dashboard;
