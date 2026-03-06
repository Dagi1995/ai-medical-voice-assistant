"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import moment from "moment";
import { SessionDetail } from "../medical-agent/[sessionId]/page";
import {
  Calendar,
  Clock,
  Stethoscope,
  FileText,
  Heart,
  Brain,
  Bone,
  Droplets,
  Eye,
  Activity,
  Download,
  Share2,
  Printer,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";
import { useTheme } from "next-themes";

type props = {
  record: SessionDetail;
};

// Specialty icons mapping
const specialtyIcon: Record<string, any> = {
  Cardiology: Heart,
  Neurology: Brain,
  Pediatrics: Activity,
  Dermatology: Droplets,
  Orthopedics: Bone,
  Ophthalmology: Eye,
};

function ViewReportDialog({ record }: props) {
  const [mounted, setMounted] = useState(false);
  const { theme, systemTheme } = useTheme();
  
  // After mounting, we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine current theme
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = mounted && currentTheme === "dark";

  const specialty = record.selectedDoctor?.specialty || "General";
  const IconComponent = specialtyIcon[specialty] || Stethoscope;
  const doctorName = record.selectedDoctor?.specialty || "Medical Specialist";
  const doctorPhoto = record.selectedDoctor?.image;

  // Parse the report if it exists
  const reportData = record.report
    ? typeof record.report === "string"
      ? JSON.parse(record.report)
      : record.report
    : null;

  const getSpecialtyColor = (specialty: string | undefined): string => {
    const colors: Record<string, string> = {
      Cardiology: isDark ? "from-red-600 to-red-700" : "from-red-500 to-red-600",
      Neurology: isDark ? "from-purple-600 to-purple-700" : "from-purple-500 to-purple-600",
      Pediatrics: isDark ? "from-green-600 to-green-700" : "from-green-500 to-green-600",
      Dermatology: isDark ? "from-yellow-600 to-yellow-700" : "from-yellow-500 to-yellow-600",
      Orthopedics: isDark ? "from-blue-600 to-blue-700" : "from-blue-500 to-blue-600",
      Ophthalmology: isDark ? "from-indigo-600 to-indigo-700" : "from-indigo-500 to-indigo-600",
    };
    return colors[specialty || ""] || (isDark ? "from-gray-700 to-gray-800" : "from-gray-500 to-gray-600");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`gap-2 w-full sm:w-auto ${
            isDark 
              ? "border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-gray-100" 
              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <FileText className="h-4 w-4" />
          <span className="sm:inline">View Report</span>
        </Button>
      </DialogTrigger>

      <DialogContent className={`w-[95vw] max-w-[1000px] sm:w-[95vw] sm:max-w-[1000px] max-h-[90vh] overflow-y-auto p-4 sm:p-6 ${
        isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      }`}>
        {/* Header Gradient */}
        <div className="absolute top-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-t-lg opacity-90" />
        
        <DialogHeader className="relative pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-0 backdrop-blur-sm w-fit"
            >
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Consultation Completed
            </Badge>

            <div className="flex gap-2 justify-end">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
              >
                <Printer className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <DialogTitle asChild>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-2">
              <div className="bg-white/20 backdrop-blur-sm p-2 sm:p-3 rounded-2xl w-fit">
                <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                  Medical AI Voice Agent Report
                </h2>
                <p className="text-white/80 text-xs sm:text-sm mt-1">
                  Session ID:{" "}
                  {record.sessionId?.slice(-8) ||
                    record.id?.toString().slice(-8) ||
                    "N/A"}
                </p>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <DialogDescription asChild>
          <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
            {/* Doctor Info Card */}
            <div className={`p-4 sm:p-6 rounded-xl border ${
              isDark 
                ? "bg-gray-800/50 border-gray-700" 
                : "bg-gradient-to-br from-gray-50 to-white border-gray-200"
            }`}>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl border-2 border-white shadow-lg">
                  <AvatarImage
                    src={doctorPhoto}
                    alt={doctorName}
                    className="object-cover"
                  />
                  <AvatarFallback
                    className={`bg-gradient-to-br ${getSpecialtyColor(
                      specialty
                    )} text-white text-xl sm:text-2xl font-bold rounded-xl`}
                  >
                    {doctorName.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <h3 className={`text-lg sm:text-xl font-semibold ${
                      isDark ? "text-gray-100" : "text-gray-900"
                    }`}>
                      {doctorName}
                    </h3>
                    <Badge
                      className={`bg-gradient-to-r ${getSpecialtyColor(
                        specialty
                      )} text-white border-0 w-fit`}
                    >
                      <IconComponent className="h-3 w-3 mr-1" />
                      {specialty}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mt-3">
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <Calendar className={`h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`} />
                      <span className={isDark ? "text-gray-300" : "text-gray-600"}>
                        {moment(record.createdOn).format("MMMM D, YYYY")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <Clock className={`h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`} />
                      <span className={isDark ? "text-gray-300" : "text-gray-600"}>
                        {moment(record.createdOn).format("h:mm A")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Consultation Notes */}
            <div className={`p-4 sm:p-6 rounded-xl border ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}>
              <h4 className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 ${
                isDark ? "text-gray-100" : "text-gray-900"
              }`}>
                <FileText className={`h-4 w-4 sm:h-5 sm:w-5 ${
                  isDark ? "text-blue-400" : "text-blue-500"
                }`} />
                Consultation Notes
              </h4>
              <div className={`p-3 sm:p-4 rounded-lg ${
                isDark ? "bg-gray-900" : "bg-gray-50"
              }`}>
                <p className={`text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  {record.notes || "No notes available for this consultation"}
                </p>
              </div>
              {!record.notes && (
                <Badge 
                  variant="outline" 
                  className={`mt-3 ${
                    isDark 
                      ? "bg-gray-900 border-gray-700 text-gray-400" 
                      : "bg-gray-50 border-gray-200 text-gray-600"
                  }`}
                >
                  <AlertCircle className="h-3 w-3 mr-1" />
                  No notes recorded
                </Badge>
              )}
            </div>

            {/* Report Data */}
            {reportData && (
              <>
                <Separator className={`my-2 sm:my-4 ${
                  isDark ? "bg-gray-800" : "bg-gray-200"
                }`} />
                <div className={`p-4 sm:p-6 rounded-xl border ${
                  isDark 
                    ? "bg-gray-800/50 border-green-900" 
                    : "bg-gradient-to-br from-green-50 to-white border-green-200"
                }`}>
                  <h4 className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 ${
                    isDark ? "text-gray-100" : "text-gray-900"
                  }`}>
                    <Info className={`h-4 w-4 sm:h-5 sm:w-5 ${
                      isDark ? "text-green-400" : "text-green-500"
                    }`} />
                    Medical Report
                  </h4>

                  <div className="space-y-3 sm:space-y-4">
                    {Object.entries(reportData).map(([key, value]) => (
                      <div
                        key={key}
                        className={`border-b pb-2 sm:pb-3 last:border-0 ${
                          isDark ? "border-green-900" : "border-green-100"
                        }`}
                      >
                        <h5 className={`text-xs sm:text-sm font-medium capitalize mb-1 ${
                          isDark ? "text-green-400" : "text-green-700"
                        }`}>
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </h5>
                        <p className={`text-xs sm:text-sm break-words ${
                          isDark ? "text-gray-400" : "text-gray-700"
                        }`}>
                          {typeof value === "object"
                            ? JSON.stringify(value, null, 2)
                            : String(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Footer Note */}
            <div className={`p-3 sm:p-4 rounded-lg border mt-6 ${
              isDark 
                ? "bg-yellow-950/30 border-yellow-900" 
                : "bg-yellow-50 border-yellow-200"
            }`}>
              <p className={`text-xs sm:text-sm flex items-start gap-2 ${
                isDark ? "text-yellow-400" : "text-yellow-800"
              }`}>
                <AlertCircle className={`h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5 ${
                  isDark ? "text-yellow-500" : "text-yellow-600"
                }`} />
                <span className="flex-1">
                  This is an AI-generated preliminary report from your voice
                  consultation. Please consult with a healthcare professional
                  for final diagnosis and treatment.
                </span>
              </p>
            </div>
          </div>
        </DialogDescription>
        
        <DialogFooter className="mt-4 sm:mt-6 flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => {}}
            className={`w-full sm:w-auto order-2 sm:order-1 ${
              isDark 
                ? "border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-gray-100" 
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Close
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto order-1 sm:order-2">
            Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ViewReportDialog;