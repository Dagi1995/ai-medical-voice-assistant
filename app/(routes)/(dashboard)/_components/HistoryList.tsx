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

  useEffect(() => {
    GetHistoryList();
  }, []);

  const GetHistoryList = async () => {
    try {
      const result = await axios.get("/api/session-chat?sessionId=all");
      console.log("history api response", result.data);
      // ensure we always store an array
      if (Array.isArray(result.data)) {
        setHistoryList(result.data);
      } else {
        setHistoryList([]);
      }
    } catch (err) {
      console.error("Failed to load history", err);
      setHistoryList([]);
    }
  };
  return (
    <div className="mt-10">
      {historyList.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-5 p-7 border border-dashed rounded-2xl">
          <Image
            className=""
            src="/image copy.png"
            alt="No History"
            width={250}
            height={200}
          />
          <h2 className=" font-bold text-xl mt-2">No Recent Consultation</h2>
          <p className="">
            It looks like you have't consulted with any doctors yet.
          </p>
          <AddNewSessionDialog></AddNewSessionDialog>
        </div>
      ) : (
        <div>
          <HistoryTable historyList={historyList} />
        </div>
      )}
    </div>
  );
}

export default HistoryList;
