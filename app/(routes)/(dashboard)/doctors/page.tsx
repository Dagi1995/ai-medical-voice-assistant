import React from "react";
import DoctorsAgentLIst from "../_components/DoctorsAgentLIst";

function DoctorsPage() {
  return (
    <div className="h-full overflow-y-auto p-4 md:p-8">
      <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Available AI Specialists
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Browse and connect with our intelligent medical assistants for your consultation needs.
        </p>
      </div>

      <DoctorsAgentLIst />
    </div>
  );
}

export default DoctorsPage;
