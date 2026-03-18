import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden animate-pulse">
      {/* Top Bar Skeleton */}
      <div className="flex items-center justify-between px-6 md:px-10 py-6 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-32 rounded-md bg-slate-200 dark:bg-slate-800" />
          <Skeleton className="h-3 w-40 rounded-md bg-slate-200 dark:bg-slate-800" />
        </div>
        <Skeleton className="h-8 w-14 rounded-full bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <Skeleton className="h-16 w-[80%] max-w-2xl rounded-2xl mb-6 bg-slate-200 dark:bg-slate-800" />
        <Skeleton className="h-8 w-[60%] max-w-xl rounded-xl mb-12 bg-slate-200 dark:bg-slate-800" />
        
        <div className="flex gap-4 mb-12">
           <Skeleton className="h-10 w-32 rounded-full bg-slate-200 dark:bg-slate-800" />
           <Skeleton className="h-10 w-40 rounded-full bg-slate-200 dark:bg-slate-800" />
           <Skeleton className="h-10 w-36 rounded-full bg-slate-200 dark:bg-slate-800" />
        </div>

        <Skeleton className="h-24 w-72 rounded-2xl bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}
