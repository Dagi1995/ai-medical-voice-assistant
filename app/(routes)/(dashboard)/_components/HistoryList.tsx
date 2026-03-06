"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AddNewSessionDialog from "./AddNewSessionDialog";
import axios from "axios";
import HistoryTable from "./HistoryTable";
import { SessionDetail } from "../medical-agent/[sessionId]/page";

function HistoryList() {
  const [historyList, setHistoryList] = useState<SessionDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetHistoryList();
  }, []);

  const GetHistoryList = async () => {
    setLoading(true);
    try {
      const result = await axios.get("/api/session-chat?sessionId=all");
      console.log("history api response", result.data);
      if (Array.isArray(result.data)) {
        setHistoryList(result.data);
      } else {
        setHistoryList([]);
      }
    } catch (err) {
      console.error("Failed to load history", err);
      setHistoryList([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    // Skeleton loader for dark/light mode
    return (
      <div className="mt-10 space-y-4">
        {[...Array(3)].map((_, idx) => (
          <div
            key={idx}
            className="h-24 rounded-xl animate-pulse bg-gray-200 dark:bg-gray-700"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-10">
      {historyList.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-5 p-7 border border-dashed rounded-2xl dark:border-gray-600">
          <Image
            src="/image copy.png"
            alt="No History"
            width={250}
            height={200}
          />
          <h2 className="font-bold text-xl mt-2 text-gray-900 dark:text-gray-100">
            No Recent Consultation
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-center">
            It looks like you haven't consulted with any doctors yet.
          </p>
          <AddNewSessionDialog />
        </div>
      ) : (
        <div className="rounded-xl border border-border dark:border-gray-600 overflow-hidden shadow-sm">
          <HistoryTable historyList={historyList} />
        </div>
      )}
    </div>
  );
}

export default HistoryList;
